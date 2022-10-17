<?php
class User {

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
        $sql = "SELECT id_user,username,vorname,nachname,adresse,plz,ort,schreiberecht,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung
                FROM tbl_user WHERE id_user = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keinen User mit der ID $id laden.");
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
        if($request->issetParameter("schreiberecht")) $this->properties->schreiberecht=1;
        else $this->properties->schreiberecht=0;
        
        if($request->getParameter("passwort") != "") $this->properties->passwort=md5($request->getParameter("passwort"));
        else unset($this->properties->passwort);
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_user == 0)
        {
            $sql = "INSERT INTO tbl_user (username,vorname,nachname,adresse,plz,ort,passwort,schreiberecht,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->username}','{$this->properties->vorname}','{$this->properties->nachname}','{$this->properties->adresse}',";
            $sql .= "'{$this->properties->plz}','{$this->properties->ort}','{$this->properties->passwort}','{$this->properties->schreiberecht}',";
            $sql .= "'{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_user SET
                    username = '{$this->properties->username}',
                    vorname = '{$this->properties->vorname}',
                    nachname = '{$this->properties->nachname}',
                    adresse = '{$this->properties->adresse}',
                    plz = '{$this->properties->plz}',
                    ort = '{$this->properties->ort}',";
            if(isset($this->properties->passwort)) $sql .= "passwort = '{$this->properties->passwort}',";
            $sql .= "schreiberecht = {$this->properties->schreiberecht},
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_user = {$this->properties->id_user}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_user == 0) $this->properties->id_user = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'User',NOW(''),'$action',{$this->properties->id_user})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_user SET aktiv=false WHERE id_user = {$this->properties->id_user}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'User',NOW(''),'Datensatz gelöscht',{$this->properties->id_user})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $user_json = json_encode($this->properties);
        str_replace ("null","\"\"", $user_json);
        return $user_json;
    }
}