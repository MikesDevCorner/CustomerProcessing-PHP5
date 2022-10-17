<?php
class Begleitperson {

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
        $sql = "SELECT id_begleitperson,tbl_begleitperson.vorname,tbl_begleitperson.nachname,id_kunde,tbl_begleitperson.mobil,tbl_begleitperson.tel,
        tbl_begleitperson.email,tbl_begleitperson.strasse,tbl_begleitperson.plz,tbl_begleitperson.ort,tbl_begleitperson.bemerkung,
        CONCAT(tbl_user.vorname,' ',tbl_user.nachname) as letzter_bearbeiter,tbl_begleitperson.letzte_bearbeitung FROM tbl_begleitperson INNER JOIN tbl_user
        ON tbl_begleitperson.id_letzter_bearbeiter = tbl_user.id_user WHERE id_begleitperson = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keine Begleitperson mit der ID $id laden.");
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
        //if($request->issetParameter("aktiv")) $this->properties->aktiv=1;
        //else $this->properties->aktiv=0;
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_begleitperson == 0)
        {
            $sql = "INSERT INTO tbl_begleitperson (id_kunde,vorname,nachname,mobil,tel,email,strasse,plz,ort,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES({$this->properties->id_kunde},'{$this->properties->vorname}','{$this->properties->nachname}','{$this->properties->mobil}','{$this->properties->tel}','{$this->properties->email}',";
            $sql .= "'{$this->properties->strasse}','{$this->properties->plz}','{$this->properties->ort}','{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_begleitperson SET
                    vorname = '{$this->properties->vorname}',
                    nachname = '{$this->properties->nachname}',
                    mobil = '{$this->properties->mobil}',
                    tel = '{$this->properties->tel}',
                    email = '{$this->properties->email}',
                    strasse = '{$this->properties->strasse}',
                    plz = '{$this->properties->plz}',
                    ort = '{$this->properties->ort}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_begleitperson = {$this->properties->id_begleitperson}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_begleitperson == 0) $this->properties->id_begleitperson = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Begleitperson',NOW(''),'$action',{$this->properties->id_begleitperson})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_begleitperson SET aktiv=false WHERE id_begleitperson = {$this->properties->id_begleitperson}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Begleitperson',NOW(''),'Datensatz gelöscht',{$this->properties->id_begleitperson})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $begleitperson_json = json_encode($this->properties);
        str_replace ("null","\"\"", $begleitperson_json);
        return $begleitperson_json;
    }
}