<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKatalogbezieherGetList implements ICommand
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
                $katalogbezieher = $request->getParameter('searchnachname');
                $plz = $request->getParameter('searchplz');
                $ort = $request->getParameter('searchort');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_katalogbezieher.aktiv = true ";
                    $critcount++;
                }
                if($katalogbezieher != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."nachname like '%$katalogbezieher%' ";
                    $critcount++;
                }
                if($plz != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."plz like '%$plz%' ";
                    $critcount++;
                }
                if($ort != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."ort like '%$ort%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_katalogbezieher.aktiv = true";
            }
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_katalogbezieher AS id, tbl_katalogbezieher.name_schule, tbl_katalogbezieher.anrede, tbl_katalogbezieher.nachname, tbl_katalogbezieher.vorname, tbl_katalogbezieher.strasse, tbl_katalogbezieher.plz, tbl_katalogbezieher.ort, tbl_katalogbezieher.bemerkung,tbl_katalogbezieher.aktiv FROM tbl_katalogbezieher $wherecrit ORDER BY id_katalogbezieher DESC limit $start,$limit";
            $sql_anzahl = "select count(id_katalogbezieher) as anzahl from tbl_katalogbezieher $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/archiv.png' alt='pic' />";
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

        } else $response->write("{success:false}");
    }
 }