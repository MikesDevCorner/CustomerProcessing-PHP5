<?php
class Anfrage {

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
        $sql = "SELECT id_anfrage, tbl_anfrage.id_turnus, id_ersatzturnus,
                tbl_anfrage.id_angebotsvorlage, eingegangen_am, name_schule,
                name_klasse, strasse_schule, plz_schule, ort_schule, telefon_schule, fax_schule, email_schule, vorname_begleitperson1,
                nachname_begleitperson1, tel_begleitperson1,mobil_begleitperson1, email_begleitperson1, strasse_begleitperson1, plz_begleitperson1, ort_begleitperson1,
                vorname_begleitperson2, nachname_begleitperson2, tel_begleitperson2,mobil_begleitperson2, email_begleitperson2, anzahl_weiblich, anzahl_maennlich,
                anzahl_begleit_weiblich, anzahl_begleit_maennlich, anzahl_vegetarier, anzahl_muslime,allergien, agb_check, anmerkung,
                ip_adresse, uebernommen, abgelehnt, tbl_anfrage.id_letzter_bearbeiter, tbl_user.username, CONCAT(tbl_user.vorname,' ',
                tbl_user.nachname) as letzter_bearbeiter, tbl_anfrage.letzte_bearbeitung, tbl_anfrage.aktiv
                FROM tbl_anfrage inner join tbl_user 
                on tbl_anfrage.id_letzter_bearbeiter = tbl_user.id_user 
                WHERE id_anfrage = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte kein Anfrage-Objekt mit der ID $id laden.");
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
        if($request->issetParameter("agb_check")) $this->properties->agb_check=1;
        else $this->properties->agb_check=0;
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_anfrage == 0)
        {
            $sql = "INSERT INTO tbl_anfrage (id_turnus,id_ersatzturnus,id_angebotsvorlage,eingegangen_am,name_schule,name_klasse,";
            $sql .= "strasse_schule,plz_schule,ort_schule,telefon_schule,fax_schule,email_schule,vorname_begleitperson1,nachname_begleitperson1,";
            $sql .= "tel_begleitperson1,mobil_begleitperson1,email_begleitperson1,strasse_begleitperson1,plz_begleitperson1,ort_begleitperson1,vorname_begleitperson2,";
            $sql .= "nachname_begleitperson2,tel_begleitperson2,mobil_begleitperson2,email_begleitperson2,anzahl_weiblich,anzahl_maennlich,anzahl_begleit_weiblich,";
            $sql .= "anzahl_begleit_maennlich,anzahl_vegetarier,anzahl_muslime,allergien,agb_check,anmerkung,letzte_bearbeitung,id_letzter_bearbeiter,ip_adresse,aktiv) ";
            $sql .= "VALUES({$this->properties->id_turnus},{$this->properties->id_ersatzturnus},{$this->properties->id_angebotsvorlage},'{$this->properties->eingegangen_am}',";
            $sql .= "'{$this->properties->name_schule}','{$this->properties->name_klasse}','{$this->properties->strasse_schule}','{$this->properties->plz_schule}',";
            $sql .= "'{$this->properties->ort_schule}','{$this->properties->telefon_schule}','{$this->properties->fax_schule}','{$this->properties->email_schule}',";
            $sql .= "'{$this->properties->vorname_begleitperson1}','{$this->properties->nachname_begleitperson1}','{$this->properties->tel_begleitperson1}','{$this->properties->mobil_begleitperson1}','{$this->properties->email_begleitperson1}',";
            $sql .= "'{$this->properties->strasse_begleitperson1}','{$this->properties->plz_begleitperson1}','{$this->properties->ort_begleitperson1}','{$this->properties->vorname_begleitperson2}',";
            $sql .= "'{$this->properties->nachname_begleitperson2}','{$this->properties->tel_begleitperson2}','{$this->properties->mobil_begleitperson2}','{$this->properties->email_begleitperson2}',{$this->properties->anzahl_weiblich},";
            $sql .= "{$this->properties->anzahl_maennlich},{$this->properties->anzahl_begleit_weiblich},{$this->properties->anzahl_begleit_maennlich},{$this->properties->anzahl_vegetarier},";
            $sql .= "{$this->properties->anzahl_muslime},'{$this->properties->allergien}',{$this->properties->agb_check},'{$this->properties->anmerkung}','".date("Y-m-d")."',".$_SESSION['id_user'].",'".$_SERVER['REMOTE_ADDR']."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_anfrage SET
                    id_turnus = {$this->properties->id_turnus},
                    id_ersatzturnus = {$this->properties->id_ersatzturnus},
                    id_angebotsvorlage = {$this->properties->id_angebotsvorlage},
                    eingegangen_am = '{$this->properties->eingegangen_am}',
                    name_schule = '{$this->properties->name_schule}',
                    name_klasse = '{$this->properties->name_klasse}',
                    strasse_schule = '{$this->properties->strasse_schule}',
                    plz_schule = '{$this->properties->plz_schule}',
                    ort_schule = '{$this->properties->ort_schule}',
                    telefon_schule = '{$this->properties->telefon_schule}',
                    fax_schule = '{$this->properties->fax_schule}',
                    email_schule = '{$this->properties->email_schule}',
                    vorname_begleitperson1 = '{$this->properties->vorname_begleitperson1}',
                    nachname_begleitperson1 = '{$this->properties->nachname_begleitperson1}',
                    tel_begleitperson1 = '{$this->properties->tel_begleitperson1}',
                    mobil_begleitperson1 = '{$this->properties->mobil_begleitperson1}',
                    email_begleitperson1 = '{$this->properties->email_begleitperson1}',
                    strasse_begleitperson1 = '{$this->properties->strasse_begleitperson1}',
                    plz_begleitperson1 = '{$this->properties->plz_begleitperson1}',
                    ort_begleitperson1 = '{$this->properties->ort_begleitperson1}',
                    vorname_begleitperson2 = '{$this->properties->vorname_begleitperson2}',
                    nachname_begleitperson2 = '{$this->properties->nachname_begleitperson2}',
                    tel_begleitperson2 = '{$this->properties->tel_begleitperson2}',
                    mobil_begleitperson2 = '{$this->properties->mobil_begleitperson2}',
                    email_begleitperson2 = '{$this->properties->email_begleitperson2}',
                    anzahl_weiblich = {$this->properties->anzahl_weiblich},
                    anzahl_maennlich = {$this->properties->anzahl_maennlich},
                    anzahl_begleit_weiblich = {$this->properties->anzahl_begleit_weiblich},
                    anzahl_begleit_maennlich = {$this->properties->anzahl_begleit_maennlich},
                    anzahl_vegetarier = {$this->properties->anzahl_vegetarier},
                    anzahl_muslime = {$this->properties->anzahl_muslime},
                    allergien = '{$this->properties->allergien}',
                    agb_check = {$this->properties->agb_check},
                    anmerkung = '{$this->properties->anmerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user'].",
                    ip_adresse = '".$_SERVER['REMOTE_ADDR']."'
                    WHERE id_anfrage = {$this->properties->id_anfrage}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if(isset($_SESSION["valid_user"]))
        {
            if($this->properties->id_anfrage == 0) $this->properties->id_anfrage = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
            $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Anfrage',NOW(''),'$action',{$this->properties->id_anfrage})");
        }
        else
        {
            $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES (0,'Anfrage',NOW(''),'$action',{$this->properties->id_anfrage})");
        }
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_anfrage SET aktiv=false WHERE id_anfrage = {$this->properties->id_anfrage}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Anfrage',NOW(''),'Datensatz gelöscht',{$this->properties->id_anfrage})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $anfrage_json = json_encode($this->properties);
        str_replace ("null","\"\"", $anfrage_json);
        return $anfrage_json;
    }
}