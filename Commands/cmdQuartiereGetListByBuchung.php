<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdQuartiereGetListByBuchung implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        $idBuchung = $request->getParameter("idBuchung");
        
       $sql = "SELECT DISTINCT tbl_quartiere.id_quartier, tbl_quartiere.quartier_name 
                FROM tbl_quartiere INNER JOIN tbl_region_quartiere ON tbl_quartiere.id_quartier = tbl_region_quartiere.id_quartier 
                INNER JOIN tbl_region ON tbl_region.id_region = tbl_region_quartiere.id_region 
                INNER JOIN tbl_region_angebotsvorlage ON tbl_region.id_region = tbl_region_angebotsvorlage.id_region 
                INNER JOIN tbl_angebotsvorlagen ON tbl_region_angebotsvorlage.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage 
                INNER JOIN tbl_buchungen ON tbl_buchungen.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage 
                WHERE tbl_buchungen.id_buchung = $idBuchung AND tbl_quartiere.aktiv = true";
        

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
        else $response->write('({"total":"1","results":' . $data . '})');

        //Freigeben von Variablen
        $ergebnis->free();
    }
 }