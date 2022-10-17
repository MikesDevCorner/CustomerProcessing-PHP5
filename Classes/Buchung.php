<?php
class Buchung {

    //***********************************************************
    //Eigenschaften eines Anfrage-Objektes (als Objekt)
    //***********************************************************
    protected $properties;
    

    //***********************************************************
    //Methoden eines Anfrage-Objektes
    //***********************************************************
    
    //Setzen eines Weres im Objekt
    public function setValue($key,$value)
    {
        $this->properties->$key = $value;
    }
    
    
    //Abrufen eines Wertes aus dem Objekt
    public function getValue($key)
    {
        return $this->properties->$key;
    }
    
    
    //Laden des objektes aus der Datenbank anhand einer ID aus dem HttpContext
    public function loadById($id, $db)
    {
        $sql = "SELECT id_buchung, tbl_buchungen.id_angebotsvorlage, angebotsname, id_erste_ansprechperson, id_zweite_ansprechperson, id_ausschreibung,
                id_anfrage, id_quartier, name_klasse, tbl_buchungen.datum, buchungs_status, anzahl_weiblich, anzahl_maennlich, anzahl_begleitpers_weiblich,
                anzahl_begleitpers_maennlich, anzahl_vegetarier, anzahl_muslime,allergien, anmerkung_kunde, abfahrtszeit_schule, ankunftszeit_schule, tbl_buchungen.preis_schueler, tbl_buchungen.preis_begleit, tbl_buchungen.preis_bus, tbl_buchungen.letzte_bearbeitung, Concat(tbl_user.vorname,' ',tbl_user.nachname) as letzter_bearbeiter
                FROM tbl_buchungen inner join tbl_user 
                on tbl_buchungen.id_letzter_bearbeiter = tbl_user.id_user INNER JOIN tbl_angebotsvorlagen ON tbl_buchungen.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage
                WHERE id_buchung = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte kein Buchungs-Objekt mit der ID $id laden.");
    }

    
    //Laden des Objektes von Requestdaten des HttpContextes
    public function loadByRequest($request)
    {
        $this->properties = new stdClass();
        foreach($request->getParameterNames() as $parameter)
        {
            $this->properties->$parameter = $request->getParameter($parameter);
        }
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_ausschreibung == "") $this->properties->id_ausschreibung = 0;
        if($this->properties->id_quartier == "") $this->properties->id_quartier = 0;
        if($this->properties->id_buchung == 0)
        
        {
            $sql = "INSERT INTO tbl_buchungen (id_quartier, id_angebotsvorlage, id_erste_ansprechperson, id_zweite_ansprechperson, id_ausschreibung,
                id_anfrage, name_klasse, datum, buchungs_status, anzahl_weiblich, anzahl_maennlich, anzahl_begleitpers_weiblich,
                anzahl_begleitpers_maennlich, anzahl_vegetarier, anzahl_muslime,allergien, anmerkung_kunde, letzte_bearbeitung,id_letzter_bearbeiter,aktiv) ";
            $sql .= "VALUES({$this->properties->id_quartier}, {$this->properties->id_angebotsvorlage},{$this->properties->id_erste_ansprechperson},{$this->properties->id_zweite_ansprechperson},{$this->properties->id_ausschreibung},";
            $sql .= "{$this->properties->id_anfrage},'{$this->properties->name_klasse}','{$this->properties->datum}','{$this->properties->buchungs_status}',{$this->properties->anzahl_weiblich},";
            $sql .= "{$this->properties->anzahl_maennlich},{$this->properties->anzahl_begleitpers_weiblich},{$this->properties->anzahl_begleitpers_maennlich},{$this->properties->anzahl_vegetarier},";
            $sql .= "{$this->properties->anzahl_muslime},'{$this->properties->allergien}','{$this->properties->anmerkung_kunde}', '".date("Y-m-d")."',".$_SESSION['id_user'].",true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_buchungen SET
            id_angebotsvorlage = {$this->properties->id_angebotsvorlage},
            id_erste_ansprechperson = {$this->properties->id_erste_ansprechperson},
            id_zweite_ansprechperson = {$this->properties->id_zweite_ansprechperson},
            id_ausschreibung = {$this->properties->id_ausschreibung},
            id_anfrage = {$this->properties->id_anfrage},
            name_klasse = '{$this->properties->name_klasse}',
            id_quartier = {$this->properties->id_quartier},
            datum = '{$this->properties->datum}',
            buchungs_status  = '{$this->properties->buchungs_status}',
            anzahl_weiblich  = {$this->properties->anzahl_weiblich},
            anzahl_maennlich = {$this->properties->anzahl_maennlich},
            anzahl_begleitpers_weiblich = {$this->properties->anzahl_begleitpers_weiblich},
            anzahl_begleitpers_maennlich = {$this->properties->anzahl_begleitpers_maennlich},
            anzahl_vegetarier = {$this->properties->anzahl_vegetarier},
            anzahl_muslime  = {$this->properties->anzahl_muslime},
            allergien = '{$this->properties->allergien}',
            anmerkung_kunde = '{$this->properties->anmerkung_kunde}',
            abfahrtszeit_schule = '{$this->properties->abfahrtszeit_schule}',
            ankunftszeit_schule = '{$this->properties->ankunftszeit_schule}',
            preis_schueler = '{$this->properties->preis_schueler}',
            preis_begleit = '{$this->properties->preis_begleit}',
            preis_bus = '{$this->properties->preis_bus}',
            letzte_bearbeitung = '".date("Y-m-d")."',
            id_letzter_bearbeiter = ".$_SESSION['id_user']."
            WHERE id_buchung = {$this->properties->id_buchung}";                    
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_buchung == 0) $this->properties->id_buchung = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Buchung',NOW(''),'$action',{$this->properties->id_buchung})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_buchungen SET aktiv=false WHERE id_buchung = {$this->properties->id_buchung}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Buchung',NOW(''),'Datensatz gelöscht',{$this->properties->id_buchung})");
    }

    public function copyEchtleistungen($db)
    {
        if($this->properties->id_buchung == 0)
        {
            $this->properties->id_buchung = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        }

        //den SQL-String bauen - bob the sql-builder :)
        $sql = "SELECT tbl_angebotsvorlage_leistungen.id_leistungen, leistungstag, standard_uhrzeit, preis FROM tbl_angebotsvorlage_leistungen
                INNER JOIN tbl_leistungen ON tbl_angebotsvorlage_leistungen.id_leistungen = tbl_leistungen.id_leistungen
                WHERE id_angebotsvorlage = {$this->properties->id_angebotsvorlage} AND tbl_leistungen.aktiv = true
                ORDER BY tbl_angebotsvorlage_leistungen.id_leistungen ASC";

        //Abschicken an die Datenbank
        $ergebnis = $db->query($sql);
        $zeilen = $db->affected_rows();

        //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
        while($zeile = $ergebnis->fetch_object())
        {
            $echtzeit = strtotime("{$this->properties->datum}");
            $amount = (($zeile->leistungstag)-1);
            if($amount == 0) $addstring = "";
            if($amount == 1) $addstring = " +1 day";
            if($amount > 1) $addstring = " +".$amount." days";
            $echtzeit = strtotime(strftime("%Y-%m-%d",$echtzeit) . $addstring);
            //$echtzeit->add(new DateInterval('P'.($zeile->leistungstag-1).'D'));
            $sql2 = "INSERT INTO tbl_echtleistungen (id_buchung,id_leistungen,echt_uhrzeit,echt_datum,echt_preis) VALUES (
                    {$this->properties->id_buchung},{$zeile->id_leistungen},'{$zeile->standard_uhrzeit}','".strftime("%Y-%m-%d",$echtzeit)."','{$zeile->preis}')";
            $ergebnis2 = $db->query($sql2);
        }
    }
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $buchung_json = json_encode($this->properties);
        str_replace ("null","\"\"", $buchung_json);
        return $buchung_json;
    }
    
    
    public function getFile($echtleistungen,$type, $db)
    {
        //Excel für Buchung erstellen und Pfad zu diesem Excel zurückschicken
        //Klasse: PHPExcel
        require_once 'Resources/PHPExcel/Classes/PHPExcel.php';
        $objPHPExcel = new PHPExcel();// Set properties
        $objPHPExcel->getProperties()->setCreator("Jugend Aktiv");
        $objPHPExcel->getProperties()->setLastModifiedBy("Jugend Aktiv");
        $objPHPExcel->getProperties()->setTitle("Buchungsbestätigung für {$this->properties->datum}, gebuchtes Paket: {$this->properties->angebotsname}");
        $objPHPExcel->getProperties()->setSubject("Buchungsbestätigung für {$this->properties->datum}, gebuchtes Paket: {$this->properties->angebotsname}");
        $objPHPExcel->getProperties()->setDescription("Buchungsbestätigung für Kunden, erstellt aus der ERP-Software customer-processing, (c) by froot.at");
        $objPHPExcel->getProperties()->setCategory("Buchungsbestätigung für Kunden");
        
        include "Classes/Begleitperson.php";
        include "Classes/Kunde.php";
        $begleitperson = new Begleitperson();
        $begleitperson->loadById($this->properties->id_erste_ansprechperson,$db);
        
        $kunde = new Kunde();
        $kunde->loadById($begleitperson->getValue("id_kunde"),$db);
        
        //Daten hinzufügen:
        // Add some data
        $sheet = $objPHPExcel->setActiveSheetIndex(0);
        
        $sheet->getColumnDimension('A')->setWidth(25);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(25);
        $sheet->getColumnDimension('E')->setWidth(25);
        
        $sheet->setCellValue('A1', '-- BUCHUNGSDATEN --');
        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getStyle('A1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
        $sheet->mergeCells('A1:E1');
        
        
        $sheet->setCellValue('A2', 'Buchungsnummer:');
        $sheet->getStyle('A2')->getFont()->setBold(true);
        $sheet->setCellValue('B2', $this->properties->id_buchung);
        $sheet->getStyle('B2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A3', 'Angebotsname:');
        $sheet->getStyle('A3')->getFont()->setBold(true);
        $sheet->setCellValue('B3', $this->properties->angebotsname);
        $sheet->getStyle('B3')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A4', 'Name Klasse:');
        $sheet->getStyle('A4')->getFont()->setBold(true);
        $sheet->setCellValue('B4', $this->properties->name_klasse);
        $sheet->getStyle('B4')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A5', 'Buchungsdatum:');
        $sheet->getStyle('A5')->getFont()->setBold(true);
        $sheet->setCellValue('B5', $this->properties->datum);
        $sheet->getStyle('B5')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A6', 'Name Schule:');
        $sheet->getStyle('A6')->getFont()->setBold(true);
        $sheet->setCellValue('B6', $kunde->getValue("name_schule"));
        $sheet->getStyle('B6')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A7', 'Ort Schule:');
        $sheet->getStyle('A7')->getFont()->setBold(true);
        $sheet->setCellValue('B7', $kunde->getValue("ort_schule"));
        $sheet->getStyle('B7')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D2', 'Anzahl weiblich:');
        $sheet->getStyle('D2')->getFont()->setBold(true);
        $sheet->setCellValue('E2', $this->properties->anzahl_weiblich);
        $sheet->getStyle('E2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D3', 'Anzahl männlich:');
        $sheet->getStyle('D3')->getFont()->setBold(true);
        $sheet->setCellValue('E3', $this->properties->anzahl_maennlich);
        $sheet->getStyle('E3')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D4', 'Anzahl Begleiter weiblich:');
        $sheet->getStyle('D4')->getFont()->setBold(true);
        $sheet->setCellValue('E4', $this->properties->anzahl_begleitpers_weiblich);
        $sheet->getStyle('E4')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D5', 'Anzahl Begleiter männlich:');
        $sheet->getStyle('D5')->getFont()->setBold(true);
        $sheet->setCellValue('E5', $this->properties->anzahl_begleitpers_maennlich);
        $sheet->getStyle('E5')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D6', 'Anzahl Vegetarier:');
        $sheet->getStyle('D6')->getFont()->setBold(true);
        $sheet->setCellValue('E6', $this->properties->anzahl_vegetarier);
        $sheet->getStyle('E6')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('D7', 'Anzahl Muslime:');
        $sheet->getStyle('D7')->getFont()->setBold(true);
        $sheet->setCellValue('E7', $this->properties->anzahl_muslime);
        $sheet->getStyle('E7')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        
        
        $sheet->setCellValue('A9', '-- LEISTUNGEN und ZEITPUNKTE --');
        $sheet->getStyle('A9')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A9')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
        $sheet->mergeCells('A9:E9');
        
        for($i=10;$i<(sizeof($echtleistungen)+10);$i++)
        {
            $sheet->setCellValue('A'.$i,$echtleistungen[$i-10]->leistungsname);
            $sheet->setCellValue('D'.$i,$echtleistungen[$i-10]->echt_uhrzeit);
            $sheet->setCellValue('B'.$i,$echtleistungen[$i-10]->echt_datum);
        }
        
        
        // Rename sheet
        $objPHPExcel->getActiveSheet()->setTitle('Buchungsbestätigung');
        $filename = date("Y-m-d G-i")." ".$this->properties->id_buchung." ".$this->properties->angebotsname;
        if($type == "pdf")
        {
            // Redirect output to a client’s web browser (Excel2007)
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment;filename="'.$filename.'.pdf"');
            header('Cache-Control: max-age=0');

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'PDF');
            $objWriter->save('php://output');
        }
        if($type == "excel")
        {
            // Redirect output to a client’s web browser (Excel5)
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
            header('Cache-Control: max-age=0');

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            $objWriter->save('php://output');
        }  
    }
}