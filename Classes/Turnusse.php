<?php
class Turnusse {

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
        $sql = "SELECT  tbl_turnusse.id_turnus,
                        tbl_turnusse.turnus_name,
                        tbl_turnusse.turnus_start,
                        tbl_turnusse.turnus_dauer,
                        tbl_turnusse.bemerkung,
                        tbl_user.username, 
                        CONCAT(tbl_user.vorname, ' ', tbl_user.nachname) AS letzter_bearbeiter,
                        tbl_turnusse.letzte_bearbeitung,
                        tbl_turnusse.aktiv
                FROM	tbl_turnusse INNER JOIN tbl_user
                        ON tbl_turnusse.id_letzter_bearbeiter = tbl_user.id_user WHERE id_turnus = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keinen Turnus mit der ID $id laden.");
    }

    
    //Laden des Objektes von Requestdaten des HttpContextes
    public function loadByRequest($request)
    {
        $this->properties = new stdClass();
        foreach($request->getParameterNames() as $parameter)
        {
            $this->properties->$parameter = $request->getParameter($parameter);
        }
        //Checkboxen werden nur dann submitted, wenn das HÃ¤kchen gesetzt ist.
        if($request->issetParameter("aktiv")) $this->properties->aktiv=1;
        else $this->properties->aktiv=0;
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        $action = "";
        if($this->properties->id_turnus == 0)
        {
            $sql = "INSERT INTO tbl_turnusse (turnus_name,turnus_start,turnus_dauer,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->turnus_name}','{$this->properties->turnus_start}','{$this->properties->turnus_dauer}',";
            $sql .= "'{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_turnusse SET
                    turnus_name = '{$this->properties->turnus_name}',
                    turnus_start = '{$this->properties->turnus_start}',
                    turnus_dauer = '{$this->properties->turnus_dauer}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_turnus = {$this->properties->id_turnus}";
            $action = "Datensatz geÃ¤ndert";                    
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_turnus == 0) $this->properties->id_turnus = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Turnus',NOW(''),'$action',{$this->properties->id_turnus})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_turnusse SET aktiv=false WHERE id_turnus = {$this->properties->id_turnus}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Turnus',NOW(''),'Datensatz gelÃ¶scht',{$this->properties->id_turnus})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $turnus_json = json_encode($this->properties);
        str_replace ("null","\"\"", $turnus_json);
        return $turnus_json;
    }
}