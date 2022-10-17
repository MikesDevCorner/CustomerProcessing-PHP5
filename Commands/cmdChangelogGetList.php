<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdChangelogGetList implements ICommand
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

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select * from tbl_changelog ORDER BY date DESC";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            //Aufbereiten des Responses
            $response->write('({"results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();

        } else $response->write("{success:false}");
    }
 }