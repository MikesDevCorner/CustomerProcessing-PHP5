<?php
class Busausschreibung {

    //***********************************************************
    //Eigenschaften eines Busausschreibungs-Objektes (als Objekt)
    //***********************************************************
    protected $properties;
    

    //***********************************************************
    //Methoden eines Busausschreibungs-Objektes
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
        //$sql = "SELECT id_ausschreibung, kurztext, datum, km, dauer, anzahl_personen,name_fahrer,handy_fahrer, tbl_busausschreibung.bemerkung, tbl_busausschreibung.id_letzter_bearbeiter,tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
        //        tbl_busausschreibung.letzte_bearbeitung,tbl_busausschreibung.aktiv
        //        FROM tbl_busausschreibung INNER JOIN tbl_user
        //        ON tbl_busausschreibung.id_letzter_bearbeiter = tbl_user.id_user WHERE id_ausschreibung = $id ";
        
        $sql = "SELECT tbl_busausschreibung.id_ausschreibung, t.preisvorschlag, t.name_busunternehmen, t.tel,
                t.strasse,t.plz,t.ort, kurztext, datum, km, dauer, anzahl_personen,name_fahrer,handy_fahrer,
                tbl_busausschreibung.bemerkung, tbl_busausschreibung.id_letzter_bearbeiter,tbl_user.username, 
                CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                tbl_busausschreibung.letzte_bearbeitung,tbl_busausschreibung.aktiv FROM tbl_busausschreibung 
                INNER JOIN tbl_user ON tbl_busausschreibung.id_letzter_bearbeiter = tbl_user.id_user 
                LEFT JOIN (SELECT id_ausschreibung, preisvorschlag, name_busunternehmen, tel, strasse, plz, ort
                FROM tbl_busunternehmen INNER JOIN tbl_busunternehmen_busausschreibung ON 
                tbl_busunternehmen.id_busunternehmen = tbl_busunternehmen_busausschreibung.id_busunternehmen 
                WHERE id_ausschreibung = $id AND gewonnen = 1) as t ON t.id_ausschreibung = t.id_ausschreibung
                WHERE tbl_busausschreibung.id_ausschreibung = $id";
        
        
        
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keine Ausschreibung mit der ID $id laden.");
    }

    
    //Laden des Objektes von Requestdaten des HttpContextes
    public function loadByRequest($request)
    {
        $this->properties = new stdClass();
        foreach($request->getParameterNames() as $parameter)
        {
            $this->properties->$parameter = $request->getParameter($parameter);
        }
        //Checkboxen werden nur dann submitted, wenn das Häkchen gesetzt ist.
        if($request->issetParameter("aktiv")) $this->properties->aktiv=1;
        else $this->properties->aktiv=0;
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db, $request)
    {
        $action = "";
        if($this->properties->id_ausschreibung == 0)
        {
            $sql = "INSERT INTO tbl_busausschreibung (kurztext,bemerkung, datum, km, dauer, anzahl_personen,name_fahrer, handy_fahrer,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->kurztext}','{$this->properties->bemerkung}','{$this->properties->datum}',{$this->properties->km},'{$this->properties->dauer}',{$this->properties->anzahl_personen},'{$this->properties->name_fahrer}','{$this->properties->handy_fahrer}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $ergebnis = $db->query($sql);
            $this->properties->id_ausschreibung = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
            $action = "neuen Datensatz angelegt";
            $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Busausschreibung',NOW(''),'$action',{$this->properties->id_ausschreibung})");
        }
        else {
            $sql = "UPDATE tbl_busausschreibung SET
                    kurztext = '{$this->properties->kurztext}',
                    bemerkung = '{$this->properties->bemerkung}',
                    datum = '{$this->properties->datum}',
                    km = {$this->properties->km},
                    dauer = '{$this->properties->dauer}',
                    anzahl_personen = {$this->properties->anzahl_personen},
                    name_fahrer = '{$this->properties->name_fahrer}',
                    handy_fahrer = '{$this->properties->handy_fahrer}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_ausschreibung = {$this->properties->id_ausschreibung}";
            $db->query($sql);
            $action = "Datensatz geändert";
            $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Busausschreibung',NOW(''),'$action',{$this->properties->id_ausschreibung})");
        }        
        
        //Einfügen der verketteten Busunternehmen
        $busunternehmen = explode("@@",$request->getParameter("busunternehmen"));
        $db->query("DELETE FROM tbl_busunternehmen_busausschreibung WHERE id_ausschreibung = {$this->properties->id_ausschreibung}");
        foreach ($busunternehmen as $key => $value)
        {
            if($value != "") 
            {
                $dataset = explode("|",$value);
                $id_busunternehmen = $dataset[0];
                $preis = $dataset[1];
                $gewonnen = $dataset[2];
                if($id_busunternehmen != "" && $id_busunternehmen != 0 && $id_busunternehmen != "0")
                {
                    $db->query("INSERT INTO tbl_busunternehmen_busausschreibung (id_ausschreibung,id_busunternehmen,preisvorschlag,gewonnen) VALUES ({$this->properties->id_ausschreibung},$id_busunternehmen,'$preis',$gewonnen)");
                }
            }
        }
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_busausschreibung SET aktiv=false WHERE id_ausschreibung = {$this->properties->id_ausschreibung}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Busausschreibung',NOW(''),'Datensatz gelöscht',{$this->properties->id_ausschreibung})");
    }
    
    
    
    public function getFile($busunternehmen,$arr,$type,$db)
    {
        //Excel für Buchung erstellen und Pfad zu diesem Excel zurückschicken
        //Klasse: PHPExcel
        require_once 'Resources/PHPExcel/Classes/PHPExcel.php';
        $objPHPExcel = new PHPExcel();// Set properties
        $objPHPExcel->getProperties()->setCreator("Jugend Aktiv");
        $objPHPExcel->getProperties()->setLastModifiedBy("Jugend Aktiv");
        $objPHPExcel->getProperties()->setTitle("{$this->properties->datum}, Kurztext: {$this->properties->kurztext}");
        $objPHPExcel->getProperties()->setSubject("{$this->properties->datum}, Kurztext: {$this->properties->kurztext}");
        $objPHPExcel->getProperties()->setDescription("Buchungsbestätigung für Kunden, erstellt aus der ERP-Software customer-processing, (c) by froot.at");
        $objPHPExcel->getProperties()->setCategory("Buchungsbestätigung für Kunden");
        
        //Daten hinzufügen:
        // Add some data
        $sheet = $objPHPExcel->setActiveSheetIndex(0);
        
        $sheet->getColumnDimension('A')->setWidth(50);
        $sheet->getColumnDimension('B')->setWidth(50);
        
        $sheet->setCellValue('A1', $busunternehmen->getValue("name_busunternehmen"));
        $sheet->setCellValue('A2', $busunternehmen->getValue("strasse"));
        $sheet->setCellValue('A3', $busunternehmen->getValue("plz")." ".$busunternehmen->getValue("ort"));
        
        $sheet->getStyle('A6')->getFont()->setBold(true);
        $sheet->setCellValue('A6', "Betreff: Ausschreibung Bustour Nr. ".$this->properties->id_ausschreibung);
        
        $sheet->setCellValue('A9', "Datum");
        $sheet->setCellValue('B9', $this->properties->datum);
        $sheet->getStyle('B9')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A10', "Kurzbeschreibung");
        $sheet->setCellValue('B10', $this->properties->kurztext);
        
        $sheet->setCellValue('A11', "km (ca)");
        $sheet->setCellValue('B11', $this->properties->km);
        $sheet->getStyle('B11')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A12', "Dauer");
        $sheet->setCellValue('B12', $this->properties->dauer);
        $sheet->getStyle('B12')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->setCellValue('A13', "Anzahl Personen");
        $sheet->setCellValue('B13', $this->properties->anzahl_personen);
        $sheet->getStyle('B13')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        
        $sheet->getStyle('A15')->getFont()->setBold(true);
        $sheet->getStyle('A16')->getFont()->setBold(true);
        $sheet->getStyle('A17')->getFont()->setBold(true);
        $sheet->setCellValue('A15', "Preis Angebot:");
        $sheet->setCellValue('A16', "Name Fahrer:");
        $sheet->setCellValue('A17', "Handy Fahrer:");
        
        
        $sheet->mergeCells('A19:B23');
        $sheet->setCellValue('A18', "Tourenbeschreibung:");
        $sheet->setCellValue('A19', $this->properties->bemerkung);
        
        $sheet->mergeCells('A25:B28');
        $sheet->setCellValue('A25', "Sehr geehrte Firma ".$busunternehmen->getValue("name_busunternehmen").", bitte füllen Sie die obigen Felder (Angebot Preis, Name Fahrer, Handy Fahrer) aus und senden Sie uns dieses Dokument als verbindliches Angebot retour.\r\n\r\nVielen Dank und freundliche Grüße\r\n\r\n{$_SESSION['printname']}");
        
        // Rename sheet
        $sheet->setTitle('Busausschreibung');
        $filename = date("Y-m-d G-i")." ".$this->properties->id_ausschreibung." ".$busunternehmen->getValue("name_busunternehmen");
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
    
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $ausschreibung_json = json_encode($this->properties);
        str_replace ("null","\"\"", $ausschreibung_json);
        return $ausschreibung_json;
    }
}