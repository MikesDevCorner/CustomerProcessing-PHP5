<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungshinweiseGetList implements ICommand
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
            $sql = "select id_buchungshinweis AS id, Concat(vorname,' ',nachname) as user, hinweis_datum as datum, hinweistext as text
                FROM tbl_buchungshinweis INNER JOIN tbl_user ON tbl_user.id_user = tbl_buchungshinweis.id_user
                WHERE id_buchung = {$request->getParameter("id_buchung")}";

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
            if($zeilen == 0) $response->write('({"total":"0","results":[]})');
            else $response->write('({"total":"0","results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();

        } else $response->write("{success:false}");
    }
 }