<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdEchtleistungenGetList implements ICommand
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
            $id_buchung = $request->getParameter("id_buchung");

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "SELECT tbl_echtleistungen.id_leistungen, tbl_leistungen.leistungsname, echt_uhrzeit, echt_datum, echt_preis FROM tbl_echtleistungen ";
            $sql .= "INNER JOIN tbl_leistungen ON tbl_leistungen.id_leistungen = tbl_echtleistungen.id_leistungen WHERE id_buchung = $id_buchung ORDER BY echt_datum, echt_uhrzeit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/product16.png' alt='pic' />";
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"total":0,"results":[]})');
            else $response->write('({"total":0,"results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();

        } else $response->write("{success:false}");
    }
 }