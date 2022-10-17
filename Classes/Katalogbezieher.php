<?php
class Katalogbezieher {

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
        $sql = "SELECT  
                tbl_katalogbezieher.id_katalogbezieher,
                tbl_katalogbezieher.name_schule,
                tbl_katalogbezieher.anrede,
                tbl_katalogbezieher.nachname,
                tbl_katalogbezieher.vorname,
                tbl_katalogbezieher.strasse,
                tbl_katalogbezieher.plz,
                tbl_katalogbezieher.ort,
                tbl_katalogbezieher.bemerkung,
                tbl_katalogbezieher.id_letzter_bearbeiter,
                tbl_user.username,
                CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                tbl_katalogbezieher.letzte_bearbeitung,
                tbl_katalogbezieher.aktiv
                FROM	tbl_katalogbezieher INNER JOIN tbl_user
                ON tbl_katalogbezieher.id_letzter_bearbeiter = tbl_user.id_user WHERE id_katalogbezieher = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keinen Katalogbezieher mit der ID $id laden.");
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
        if($this->properties->id_katalogbezieher == 0)
        {
            $action = "";
            $sql = "INSERT INTO tbl_katalogbezieher (name_schule,anrede,vorname,nachname,strasse,plz,ort,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->name_schule}','{$this->properties->anrede}','{$this->properties->vorname}','{$this->properties->nachname}','{$this->properties->strasse}','{$this->properties->plz}',";
            $sql .= "'{$this->properties->ort}','{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_katalogbezieher SET
                    name_schule = '{$this->properties->name_schule}',
                    anrede = '{$this->properties->anrede}',
                    vorname = '{$this->properties->vorname}',
                    nachname = '{$this->properties->nachname}',
                    strasse = '{$this->properties->strasse}',
                    plz = '{$this->properties->plz}',
                    ort = '{$this->properties->ort}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_katalogbezieher = {$this->properties->id_katalogbezieher}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_katalogbezieher == 0) $this->properties->id_katalogbezieher = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Katalogbezieher',NOW(''),'$action',{$this->properties->id_katalogbezieher})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_katalogbezieher SET aktiv=false WHERE id_katalogbezieher = {$this->properties->id_katalogbezieher}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Katalogbezieher',NOW(''),'Datensatz gelöscht',{$this->properties->id_katalogbezieher})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $katalogbezieher_json = json_encode($this->properties);
        str_replace ("null","\"\"", $katalogbezieher_json);
        return $katalogbezieher_json;
    }
}