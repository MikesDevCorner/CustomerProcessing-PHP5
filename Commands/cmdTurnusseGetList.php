<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdTurnusseGetList implements ICommand
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
                $turnusvon = $request->getParameter('searchturnusvon');
                $turnusbis = $request->getParameter('searchturnusbis');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_turnusse.aktiv = true ";
                    $critcount++;
                }
                if($turnusvon != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."turnus_start >= '$turnusvon' ";
                    $critcount++;
                }
                if($turnusbis != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."turnus_start <= '$turnusbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_turnusse.aktiv = true";
            }
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "SELECT id_turnus AS id, turnus_name, turnus_start, turnus_dauer, bemerkung,tbl_turnusse.aktiv FROM tbl_turnusse $wherecrit ORDER BY turnus_start DESC limit $start,$limit";
            $sql_anzahl = "select count(id_turnus) as anzahl from tbl_turnusse $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/calendar_date.png' alt='pic' />";
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

        //} else $response->write("{success:false}");
    }
 }