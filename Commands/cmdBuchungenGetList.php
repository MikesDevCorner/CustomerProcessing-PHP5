<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungenGetList implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request))
        {
            //Werte für Paging
            $start = (integer) $request->getParameter('start');
            $limit = (integer) $request->getParameter('limit');
            
            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $buchungsnr = (int) $request->getParameter('searchid');
                $kunde = $request->getParameter('searchkunde');
                $klasse = $request->getParameter('searchklasse');
                $status = $request->getParameter('searchstatus');
                $terminvon = $request->getParameter('searchterminvon');
                $terminbis = $request->getParameter('searchterminbis');
                $angebotsvorlage = $request->getParameter('searchangebotsvorlage');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "where ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_buchungen.aktiv = true ";
                    $critcount++;
                }
                if($buchungsnr != 0)
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_buchung = $buchungsnr ";
                    $critcount++;
                }
                if($kunde != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_kunde.name_schule like '%$kunde%' ";
                    $critcount++;
                }
                if($angebotsvorlage != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."angebotsname like '%$angebotsvorlage%' ";
                    $critcount++;
                }
                if($status != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_buchungen.buchungs_status like '%$status%' ";
                    $critcount++;
                }

                if($klasse != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."name_klasse like '%$klasse%' ";
                    $critcount++;
                }
                if($terminvon != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."datum >= '$terminvon' ";
                    $critcount++;
                }
                if($terminbis != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."datum <= '$terminbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_buchungen.aktiv = true";
            }
            

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_buchung as id, angebotsname, name_schule, datum, tbl_buchungen.aktiv FROM tbl_buchungen LEFT JOIN tbl_angebotsvorlagen ON tbl_angebotsvorlagen.id_angebotsvorlage = tbl_buchungen.id_angebotsvorlage ";
            $sql .= "LEFT JOIN tbl_begleitperson ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson LEFT JOIN tbl_kunde ON tbl_begleitperson.id_kunde = tbl_kunde.id_kunde ";
            $sql .= "$wherecrit ORDER BY datum ASC limit $start,$limit";
            $sql_anzahl = "select count(id_buchung) as anzahl from tbl_buchungen LEFT JOIN tbl_angebotsvorlagen ON tbl_angebotsvorlagen.id_angebotsvorlage = tbl_buchungen.id_angebotsvorlage LEFT JOIN tbl_begleitperson ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson LEFT JOIN tbl_kunde ON tbl_begleitperson.id_kunde = tbl_kunde.id_kunde $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/shopping_cart.png' alt='pic' />";
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            $ergebnis_anzahl = $db->query($sql_anzahl);
            $anzahl = $ergebnis_anzahl->fetch_object()->anzahl;

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"total":"0","results":[]})');
            else $response->write('({"total":"' . $anzahl . '","results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();
            $ergebnis_anzahl->free();

        } else $response->write("{success:false}");
    }
 }