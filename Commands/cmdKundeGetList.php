<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKundeGetList implements ICommand
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
                $kundennr = (int) $request->getParameter('searchid');
                $name = $request->getParameter('searchname');
                $plz = $request->getParameter('searchplz');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "where ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_kunde.aktiv = true ";
                    $critcount++;
                }
                if($kundennr != 0)
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_kunde.id_kunde = $kundennr ";
                    $critcount++;
                }
                if($name != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_kunde.name_schule like '%$name%' ";
                    $critcount++;
                }
                if($plz != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_kunde.plz_schule like '%$plz%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_kunde.aktiv = true";
            }
            

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_kunde as id, name_schule, plz_schule,ort_schule,tbl_kunde.aktiv FROM tbl_kunde";
            $sql .= " $wherecrit ORDER BY name_schule ASC limit $start,$limit";
            $sql_anzahl = "select count(id_kunde) as anzahl from tbl_kunde $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/community_users.png' alt='pic' />";
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