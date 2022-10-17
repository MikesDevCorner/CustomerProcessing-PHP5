<?php
class Quartiere {

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
        $sql = "select
                        tbl_quartiere.id_quartier,
                        tbl_quartiere.quartier_name,
                        tbl_quartiere.quartier_adresse,
                        tbl_quartiere.quartier_plz,
                        tbl_quartiere.quartier_ort,
                        tbl_quartiere.quartier_vorname,
                        tbl_quartiere.quartier_nachname,
                        tbl_quartiere.quartier_telefon,
                        tbl_quartiere.quartier_handy,
                        tbl_quartiere.quartier_email,
                        tbl_quartiere.quartier_bemerkung,
                        tbl_quartiere.id_letzter_bearbeiter,
                        tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                        tbl_quartiere.letzte_bearbeitung,
                        tbl_quartiere.aktiv
                from 	tbl_quartiere inner join tbl_user on tbl_quartiere.id_letzter_bearbeiter = tbl_user.id_user
                where	tbl_quartiere.id_quartier = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte kein Quartier mit der ID $id laden.");
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
        if($this->properties->id_quartier == 0)
        {
            $sql = "INSERT INTO tbl_quartiere (quartier_name,quartier_adresse,quartier_plz,quartier_ort,
                    quartier_vorname,quartier_nachname,quartier_telefon,quartier_handy,quartier_email,
                    quartier_bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->quartier_name}',
                            '{$this->properties->quartier_adresse}',
                            '{$this->properties->quartier_plz}',
                            '{$this->properties->quartier_ort}',
                            '{$this->properties->quartier_vorname}',
                            '{$this->properties->quartier_nachname}',
                            '{$this->properties->quartier_telefon}',
                            '{$this->properties->quartier_handy}',
                            '{$this->properties->quartier_email}',
                            '{$this->properties->quartier_bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";            
        }
        else {
            $sql = "UPDATE tbl_quartiere SET
                    quartier_name = '{$this->properties->quartier_name}',
                    quartier_adresse = '{$this->properties->quartier_adresse}',
                    quartier_plz = '{$this->properties->quartier_plz}',
                    quartier_ort = '{$this->properties->quartier_ort}',
                    quartier_vorname = '{$this->properties->quartier_vorname}',
                    quartier_nachname = '{$this->properties->quartier_nachname}',
                    quartier_telefon = '{$this->properties->quartier_telefon}',
                    quartier_handy = '{$this->properties->quartier_handy}',
                    quartier_email = '{$this->properties->quartier_email}',
                    quartier_bemerkung = '{$this->properties->quartier_bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_quartier = {$this->properties->id_quartier}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_quartier == 0) $this->properties->id_quartier = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Qaurtiere',NOW(''),'$action',{$this->properties->id_quartier})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_quartiere SET aktiv=false WHERE id_quartier = {$this->properties->id_quartier}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Quartiere',NOW(''),'Datensatz gelöscht',{$this->properties->id_quartier})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $quartiere_json = json_encode($this->properties);
        str_replace ("null","\"\"", $quartiere_json);
        return $quartiere_json;
    }
}