<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusausschreibungGetList implements ICommand
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
                $kurztext = $request->getParameter('searchkurztext');
                $nr = $request->getParameter('searchid');
                $datumvon = $request->getParameter('searchdatumvon');
                $datumbis = $request->getParameter('searchdatumbis');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."aktiv = true ";
                    $critcount++;
                }
                if($kurztext != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."kurztext like '%$kurztext%' ";
                    $critcount++;
                }
                if($nr != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_ausschreibung = $nr ";
                    $critcount++;
                }
                if($datumvon != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."datum >= '$datumvon' ";
                    $critcount++;
                }
                if($datumbis != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."datum <= '$datumbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where aktiv = true";
            }
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_ausschreibung AS id, datum, kurztext, CONCAT(id_ausschreibung,'.) ',kurztext) as idtext,tbl_busausschreibung.aktiv FROM tbl_busausschreibung $wherecrit ORDER BY id_ausschreibung DESC limit $start,$limit";
            $sql_anzahl = "select count(id_ausschreibung) as anzahl from tbl_busausschreibung $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/mail_next.png' alt='pic' />";
                $sql = "SELECT COUNT(id_buchung) as anz FROM tbl_buchungen WHERE id_ausschreibung = {$zeile->id} AND aktiv = true";
                $second_erg = $db->query($sql);
                $zeile->anz_buchungen = $second_erg->fetch_object()->anz;
                $sql = "SELECT anzahl_weiblich, anzahl_maennlich, anzahl_begleitpers_weiblich, anzahl_begleitpers_maennlich FROM tbl_buchungen WHERE id_ausschreibung = {$zeile->id} AND aktiv = true";
                $second_erg = $db->query($sql);
                $anz_persons = 0;
                while($sec_zeile = $second_erg->fetch_object())
                {
                    $anz_persons = $anz_persons + $sec_zeile->anzahl_weiblich + $sec_zeile->anzahl_maennlich + $sec_zeile->anzahl_begleitpers_weiblich + $sec_zeile->anzahl_begleitpers_maennlich;
                }
                $zeile->anz_persons = $anz_persons;
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