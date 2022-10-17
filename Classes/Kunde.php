<?php
class Kunde {

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
        $sql = "SELECT id_kunde,name_schule,strasse_schule,ort_schule, plz_schule,telefon_schule,fax_schule,email_schule,tbl_kunde.bemerkung,
        CONCAT(tbl_user.vorname,' ',tbl_user.nachname) as letzter_bearbeiter,tbl_kunde.letzte_bearbeitung FROM tbl_kunde INNER JOIN tbl_user
        ON tbl_kunde.id_letzter_bearbeiter = tbl_user.id_user WHERE id_kunde = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keinen Kunden mit der ID $id laden.");
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
        if($this->properties->id_kunde == 0)
        {
            $sql = "INSERT INTO tbl_kunde (name_schule,strasse_schule,plz_schule,ort_schule,telefon_schule,fax_schule,email_schule,id_letzter_bearbeiter,letzte_bearbeitung,bemerkung,aktiv) ";
            $sql .= "VALUES('{$this->properties->name_schule}','{$this->properties->strasse_schule}','{$this->properties->plz_schule}','{$this->properties->ort_schule}','{$this->properties->telefon_schule}',";
            $sql .= "'{$this->properties->fax_schule}','{$this->properties->email_schule}',".$_SESSION['id_user'].",'".date("Y-m-d")."','{$this->properties->bemerkung}',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_kunde SET
                    name_schule = '{$this->properties->name_schule}',
                    strasse_schule = '{$this->properties->strasse_schule}',
                    plz_schule = '{$this->properties->plz_schule}',
                    ort_schule = '{$this->properties->ort_schule}',
                    telefon_schule = '{$this->properties->telefon_schule}',
                    fax_schule = '{$this->properties->fax_schule}',
                    email_schule = '{$this->properties->email_schule}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_kunde = {$this->properties->id_kunde}";
            $action = "Datensatz geändert";
        }
        $ergebnis = $db->query($sql);
        if($this->properties->id_kunde == 0) $this->properties->id_kunde = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Kunde',NOW(''),'$action',{$this->properties->id_kunde})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_kunde SET aktiv=false WHERE id_kunde = {$this->properties->id_kunde}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Kunde',NOW(''),'Datensatz gelöscht',{$this->properties->id_kunde})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $kunden_json = json_encode($this->properties);
        str_replace ("null","\"\"", $kunden_json);
        return $kunden_json;
    }
}