<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdHistoryGetList implements ICommand
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
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "SELECT * FROM tbl_history INNER JOIN tbl_user ON tbl_history.id_user = tbl_user.id_user WHERE tbl_history.id_user = {$_SESSION['id_user']} ORDER BY tbl_history.date DESC limit $start,$limit";
            $sql_anzahl = "select count(id_history) as anzahl from tbl_history WHERE tbl_history.id_user = {$_SESSION['id_user']}";
            
            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
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

        } else $response->write("{success:false}");
    }
 }