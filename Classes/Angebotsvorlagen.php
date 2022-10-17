<?php
class Angebotsvorlagen {

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
        $sql = "SELECT  tbl_angebotsvorlagen.id_angebotsvorlage,
                        tbl_angebotsvorlagen.angebotsname,
                        tbl_angebotsvorlagen.bemerkung,
                        tbl_angebotsvorlagen.id_letzter_bearbeiter,
                        tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                        tbl_angebotsvorlagen.letzte_bearbeitung,
                        tbl_angebotsvorlagen.aktiv
                FROM    tbl_angebotsvorlagen INNER JOIN tbl_user ON tbl_angebotsvorlagen.id_letzter_bearbeiter = tbl_user.id_user
                WHERE tbl_angebotsvorlagen.id_angebotsvorlage = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keine Angebotsvorlage mit der ID $id laden.");
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
        if($this->properties->id_angebotsvorlage == 0)
        {
            $sql = "INSERT INTO tbl_angebotsvorlagen (angebotsname,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->angebotsname}','{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";            
        }
        else {
            $sql = "UPDATE tbl_angebotsvorlagen SET
                    angebotsname = '{$this->properties->angebotsname}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_angebotsvorlage = {$this->properties->id_angebotsvorlage}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_angebotsvorlage == 0) $this->properties->id_angebotsvorlage = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Angebotsvorlage',NOW(''),'$action',{$this->properties->id_angebotsvorlage})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_angebotsvorlagen SET aktiv=false WHERE id_angebotsvorlage = {$this->properties->id_angebotsvorlage}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Angebotsvorlage',NOW(''),'Datensatz gelöscht',{$this->properties->id_angebotsvorlage})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $angebotsvorlagen_json = json_encode($this->properties);
        str_replace ("null","\"\"", $angebotsvorlagen_json);
        return $angebotsvorlagen_json;
    }
}