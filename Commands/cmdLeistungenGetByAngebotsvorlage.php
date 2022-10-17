<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdLeistungenGetByAngebotsvorlage implements ICommand
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
            $angebotsvorlage_id = $request->getParameter('angebotsvorlageId');
            $sql = "SELECT tbl_leistungen.id_leistungen, leistungsname, leistungstag FROM ";
            $sql .= "tbl_leistungen INNER JOIN tbl_angebotsvorlage_leistungen ON tbl_leistungen.id_leistungen = tbl_angebotsvorlage_leistungen.id_leistungen ";
            $sql .= "WHERE id_angebotsvorlage = $angebotsvorlage_id ORDER BY leistungstag ASC";
            
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
            else $response->write('({"results":' . $data . '})');

        } else $response->write("{success:false}");
    }
 }