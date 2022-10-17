<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungenLoadByBustour implements ICommand
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
           $id_ausschreibung = "";
           $sql = "";
           
           if($request->issetParameter("id_buchung"))
           {
                $id_buchung = $request->getParameter("id_buchung");
                $sql = "SELECT tbl_buchungen.id_buchung as id, tbl_buchungen.datum, anzahl_weiblich, anzahl_maennlich, anzahl_begleitpers_weiblich, anzahl_begleitpers_maennlich, name_schule as schule FROM tbl_buchungen INNER JOIN tbl_begleitperson ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson INNER JOIN tbl_kunde ON tbl_begleitperson.id_kunde = tbl_kunde.id_kunde WHERE tbl_buchungen.id_buchung = $id_buchung";   
           }
           else {
                $id_ausschreibung = $request->getParameter("id_ausschreibung");
                $sql = "SELECT tbl_buchungen.id_buchung as id, tbl_buchungen.datum, anzahl_weiblich, anzahl_maennlich, anzahl_begleitpers_weiblich, anzahl_begleitpers_maennlich, name_schule as schule FROM tbl_buchungen INNER JOIN tbl_begleitperson ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson INNER JOIN tbl_kunde ON tbl_begleitperson.id_kunde = tbl_kunde.id_kunde WHERE tbl_buchungen.id_ausschreibung = $id_ausschreibung AND tbl_buchungen.aktiv = true";   
           }

            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->anzahl_pers = $zeile->anzahl_weiblich + $zeile->anzahl_maennlich + $zeile->anzahl_begleitpers_weiblich + $zeile->anzahl_begleitpers_maennlich;
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