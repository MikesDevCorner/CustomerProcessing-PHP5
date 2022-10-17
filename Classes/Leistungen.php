<?php
class Leistungen {

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
        $sql = "SELECT id_leistungen,leistungsname,tbl_leistungen.id_partner,tbl_partner.firmenname AS partner,standard_uhrzeit,preis,
                tbl_leistungen.bemerkung,tbl_leistungen.id_letzter_bearbeiter,
		tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                tbl_leistungen.letzte_bearbeitung,tbl_leistungen.aktiv
                FROM tbl_leistungen INNER JOIN tbl_partner ON tbl_leistungen.id_partner = tbl_partner.id_partner
		INNER JOIN tbl_user ON tbl_leistungen.id_letzter_bearbeiter = tbl_user.id_user
                WHERE id_leistungen = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keine Leistung mit der ID $id laden.");
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
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_leistungen == 0)
        {
            $sql = "INSERT INTO tbl_leistungen (leistungsname,id_partner,standard_uhrzeit,preis,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->leistungsname}',{$this->properties->id_partner},'{$this->properties->standard_uhrzeit}','{$this->properties->preis}',";
            $sql .= "'{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_leistungen SET
                    leistungsname = '{$this->properties->leistungsname}',
                    id_partner = '{$this->properties->id_partner}',
                    standard_uhrzeit = '{$this->properties->standard_uhrzeit}',
                    preis = '{$this->properties->preis}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_leistungen = {$this->properties->id_leistungen}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_leistungen == 0) $this->properties->id_leistungen = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Leistung',NOW(''),'$action',{$this->properties->id_leistungen})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_leistungen SET aktiv=false WHERE id_leistungen = {$this->properties->id_leistungen}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Leistung',NOW(''),'Datensatz gelöscht',{$this->properties->id_leistungen})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $leistung_json = json_encode($this->properties);
        str_replace ("null","\"\"", $leistung_json);
        return $leistung_json;
    }
}
