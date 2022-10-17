<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdTurnusseGetLookup implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        //if (Auth::authenticate($db, $request))
        //{
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "SELECT id_turnus AS id, turnus_start as datum, turnus_dauer as dauer FROM tbl_turnusse WHERE aktiv=true ORDER BY turnus_start DESC";

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

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"results":[]})');
            else $response->write('{"results":' . $data . '}');

            //Freigeben von Variablen
            $ergebnis->free();

        //} else $response->write("{success:false}");
    }
 }