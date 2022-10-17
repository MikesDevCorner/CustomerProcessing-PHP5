<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenGetList implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        //if (Auth::authenticate($db, $request))
        //{
            //Werte für Paging
            $start = (integer) $request->getParameter('start');
            $limit = (integer) $request->getParameter('limit');

            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $angebotsvorlagen = $request->getParameter('searchangebotsname');
                $region = $request->getParameter('searchregion');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_angebotsvorlagen.aktiv = true ";
                    $critcount++;
                }
                if($angebotsvorlagen != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."angebotsname like '%$angebotsvorlagen%' ";
                    $critcount++;
                }
                if($region != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_region = $region ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_angebotsvorlagen.aktiv = true";
            }
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select distinct tbl_angebotsvorlagen.id_angebotsvorlage AS id, angebotsname,tbl_angebotsvorlagen.aktiv FROM tbl_angebotsvorlagen LEFT JOIN tbl_region_angebotsvorlage ON tbl_angebotsvorlagen.id_angebotsvorlage = tbl_region_angebotsvorlage.id_angebotsvorlage
                    $wherecrit ORDER BY tbl_angebotsvorlagen.id_angebotsvorlage DESC limit $start,$limit";
            $sql_anzahl = "select count(tbl_angebotsvorlagen.id_angebotsvorlage) as anzahl FROM tbl_angebotsvorlagen LEFT JOIN tbl_region_angebotsvorlage ON tbl_angebotsvorlagen.id_angebotsvorlage = tbl_region_angebotsvorlage.id_angebotsvorlage $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();
            
            $arr = array();
            
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/inventory-maintenance16.png' alt='pic' />";
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

        //} else $response->write("{success:false}");
    }
 }