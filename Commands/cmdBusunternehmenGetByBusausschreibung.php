<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusunternehmenGetByBusausschreibung implements ICommand
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
            $sql = "SELECT id_busunternehmen as id, preisvorschlag, gewonnen FROM tbl_busunternehmen_busausschreibung WHERE id_ausschreibung = {$request->getParameter("id_ausschreibung")}";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/bus.png' alt='pic' />";
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"results":[]})');
            else $response->write('({"results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();

        } else $response->write("{success:false}");
    }
 }