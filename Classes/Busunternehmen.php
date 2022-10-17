<?php
class Busunternehmen {

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
        $sql = "SELECT tbl_busunternehmen.id_busunternehmen,tbl_busunternehmen.name_busunternehmen,tbl_busunternehmen.strasse,tbl_busunternehmen.plz,
	tbl_busunternehmen.ort,tbl_busunternehmen.tel,tbl_busunternehmen.bemerkung,tbl_busunternehmen.id_letzter_bearbeiter,
	tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
        tbl_busunternehmen.letzte_bearbeitung,tbl_busunternehmen.aktiv
        FROM tbl_busunternehmen INNER JOIN tbl_user ON tbl_busunternehmen.id_letzter_bearbeiter = tbl_user.id_user WHERE id_busunternehmen = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte kein Bustunternehmen mit der ID $id laden.");
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
        if($this->properties->id_busunternehmen == 0)
        {
            $sql = "INSERT INTO tbl_busunternehmen (name_busunternehmen,strasse,plz,ort,tel,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->name_busunternehmen}','{$this->properties->strasse}','{$this->properties->plz}','{$this->properties->ort}',";
            $sql .= "'{$this->properties->tel}','{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_busunternehmen SET
                    name_busunternehmen = '{$this->properties->name_busunternehmen}',
                    strasse = '{$this->properties->strasse}',
                    plz = '{$this->properties->plz}',
                    ort = '{$this->properties->ort}',
                    tel = '{$this->properties->tel}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_busunternehmen = {$this->properties->id_busunternehmen}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_busunternehmen == 0) $this->properties->id_busunternehmen = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Busunternehmen',NOW(''),'$action',{$this->properties->id_busunternehmen})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_busunternehmen SET aktiv=false WHERE id_busunternehmen = {$this->properties->id_busunternehmen}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Busunternehmen',NOW(''),'Datensatz gelöscht',{$this->properties->id_busunternehmen})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $busunternehmen_json = json_encode($this->properties);
        str_replace ("null","\"\"", $busunternehmen_json);
        return $busunternehmen_json;
    }
}