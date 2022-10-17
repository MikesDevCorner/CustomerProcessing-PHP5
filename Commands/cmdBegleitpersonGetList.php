<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBegleitpersonGetList implements ICommand
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
            //$start = (integer) $request->getParameter('start');
            //$limit = (integer) $request->getParameter('limit');
            $id_kunde = (integer) $request->getParameter('id_kunde');
            
            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $begleitpersonnr = (int) $request->getParameter('searchid');
                $nachname = $request->getParameter('searchnachname');
                $plz = $request->getParameter('searchplz');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "where ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."tbl_begleitperson.aktiv = true AND id_kunde = $id_kunde";
                    $critcount++;
                }
                if($begleitpersonnr != 0)
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_begleitperson = $begleitpersonnr ";
                    $critcount++;
                }
                if($nachname != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."nachname like '%$name%' ";
                    $critcount++;
                }
                if($plz != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."plz like '%$plz%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where tbl_begleitperson.aktiv = true AND id_kunde = $id_kunde";
            }
            

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_begleitperson as id, vorname, nachname, CONCAT(vorname,' ',nachname) as fullname, plz, ort,tbl_begleitperson.aktiv FROM tbl_begleitperson";
            $sql .= " $wherecrit ORDER BY id_begleitperson DESC";
            $sql_anzahl = "select count(id_begleitperson) as anzahl from tbl_begleitperson $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/user.png' alt='pic' />";
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