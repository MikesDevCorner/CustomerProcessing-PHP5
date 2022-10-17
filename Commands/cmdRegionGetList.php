<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdRegionGetList implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        
        if($request->issetParameter("mode") && $request->getParameter("mode") == "lookup" )
        {
            $ergebnis = $db->query("SELECT id_region AS id, name_region AS region FROM tbl_region");
            $arr = array();
            while($zeile = $ergebnis->fetch_object())  $arr[] = $zeile;
            $data = json_encode($arr);
            $response->write('({"results":' . $data . '})');
        }
        else
        {
            //Werte für Paging
            $start = (integer) $request->getParameter('start');
            $limit = (integer) $request->getParameter('limit');
            $query = $request->getParameter('query');

            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $region = $request->getParameter('searchregion');
                $bl = $request->getParameter('searchbl');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."aktiv = true ";
                    $critcount++;
                }
                if($region != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."name_region like '%$region%' ";
                    $critcount++;
                }
                if($bl != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."bundesland like '%$bl%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where aktiv = true";
            }

            //den SQL-String bauen - bob the sql-builder :)
            if($query != "")
            {
                $sql = "select id_region as id, name_region AS region
                        from tbl_region
                        WHERE aktiv = true AND name_region LIKE '%$query%' ORDER BY region ASC limit $start,$limit";
                $sql_anzahl = "select count(id_region) as anzahl from tbl_region where aktiv = true AND name_region LIKE '%$query%'";
            }
            else
            {

            $sql = "select id_region AS id, name_region AS region, bundesland, bemerkung,tbl_region.aktiv FROM tbl_region $wherecrit ORDER BY id_region DESC limit $start,$limit";
            $sql_anzahl = "select count(id_region) as anzahl from tbl_region $wherecrit";
            }
            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/globe_16.png' alt='pic' />";
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            $ergebnis_anzahl = $db->query($sql_anzahl);
            $anzahl = $ergebnis_anzahl->fetch_object()->anzahl;

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"total":"0","results":[]})');
            else $response->write('{"total":' . $anzahl . ',"results":' . $data . '}');

            //Freigeben von Variablen
            $ergebnis->free();
            $ergebnis_anzahl->free();
        }
            
    }
 }