<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdQuartiereGetList implements ICommand
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
            $query = $request->getParameter('query');

            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $quartiere = $request->getParameter('searchquartier_name');
                $plz = $request->getParameter('searchquartier_plz');
                $ort = $request->getParameter('searchquartier_ort');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_quartiere.aktiv = true ";
                    $critcount++;
                }
                if($quartiere != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_quartiere.quartier_name like '%$quartiere%' ";
                    $critcount++;
                }
                if($plz != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tblquartiere.quartier_plz = $plz ";
                    $critcount++;
                }
                 if($ort != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_quartiere.quartier_ort like '%$ort%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_quartiere.aktiv = true";
            }

            if($query != "")
            {
                $sql = "select tbl_quartiere.id_quartier as id, tbl_quartiere.quartier_name
                        from tbl_quartiere
                        WHERE aktiv = true AND quartier_name LIKE '%$query%' ORDER BY quartier_name ASC limit $start,$limit";
                $sql_anzahl = "select count(id_quartier) as anzahl from tbl_quartiere where aktiv = true AND quartier_name LIKE '%$query%'";
            }
            else
            {

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select distinct tbl_quartiere.id_quartier AS id, quartier_name,quartier_plz,quartier_ort,tbl_quartiere.aktiv FROM tbl_quartiere LEFT JOIN tbl_region_quartiere ON tbl_quartiere.id_quartier = tbl_region_quartiere.id_quartier
                    $wherecrit ORDER BY tbl_quartiere.quartier_name DESC limit $start,$limit";
            $sql_anzahl = "select count(tbl_quartiere.id_quartier) as anzahl FROM tbl_quartiere LEFT JOIN tbl_region_quartiere ON tbl_quartiere.id_quartier = tbl_region_quartiere.id_quartier $wherecrit";
            }
            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();
            
            $arr = array();
            
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/bed.png' alt='pic' />";
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