<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAnfragenGetList implements ICommand
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
                $anfragennr = (int) $request->getParameter('searchid');
                $schule = $request->getParameter('searchschule');
                $terminvon = $request->getParameter('searchterminvon');
                $terminbis = $request->getParameter('searchterminbis');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "where ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_anfrage.aktiv = true ";
                    $critcount++;
                }
                if($anfragennr != 0)
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_anfrage = $anfragennr ";
                    $critcount++;
                }
                if($schule != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."name_schule like '%$schule%' ";
                    $critcount++;
                }
                if($terminvon != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."turnus_start >= '$terminvon' ";
                    $critcount++;
                }
                if($terminbis != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."turnus_start <= '$terminbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_anfrage.aktiv = true";
            }
            

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_anfrage as id, angebotsname as angebot, name_schule as schule, turnus_start as termin,tbl_anfrage.aktiv from tbl_anfrage inner join tbl_angebotsvorlagen on tbl_anfrage.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage ";
            $sql .= "inner join tbl_turnusse on tbl_anfrage.id_turnus = tbl_turnusse.id_turnus $wherecrit ORDER BY id_anfrage DESC limit $start,$limit";
            $sql_anzahl = "select count(id_anfrage) as anzahl from tbl_anfrage inner join tbl_turnusse on tbl_anfrage.id_turnus = tbl_turnusse.id_turnus $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/bookmark_16.png' alt='pic' />";
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