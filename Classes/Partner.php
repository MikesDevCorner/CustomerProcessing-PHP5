<?php
class Partner {

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
        $sql = "SELECT tbl_partner.id_partner,tbl_partner.firmenname,tbl_partner.titel,tbl_partner.vorname,tbl_partner.nachname,
                tbl_partner.adresse,tbl_partner.plz,tbl_partner.ort,tbl_partner.tel,tbl_partner.fax,tbl_partner.handy,tbl_partner.email,
                tbl_partner.homepage,tbl_partner.bemerkung,tbl_partner.id_letzter_bearbeiter,tbl_user.username, CONCAT(tbl_user.vorname,' ', tbl_user.nachname) AS letzter_bearbeiter,
                tbl_partner.letzte_bearbeitung,tbl_partner.aktiv
                FROM 	tbl_partner INNER JOIN tbl_user
                        ON tbl_partner.id_letzter_bearbeiter = tbl_user.id_user WHERE id_partner = $id";
        $ergebnis = $db->query($sql);

        if($db->affected_rows() == 1)
        {
            $this->properties = $ergebnis->fetch_object();
        }
        else throw new Exception("Konnte keinen Partner mit der ID $id laden.");
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
        if($this->properties->id_partner == 0)
        {
            $sql = "INSERT INTO tbl_partner (firmenname,titel,vorname,nachname,adresse,plz,ort,tel,fax,handy,email,homepage,bemerkung,id_letzter_bearbeiter,letzte_bearbeitung,aktiv) ";
            $sql .= "VALUES('{$this->properties->firmenname}','{$this->properties->titel}','{$this->properties->vorname}','{$this->properties->nachname}','{$this->properties->adresse}','{$this->properties->plz}',";
            $sql .= "'{$this->properties->ort}','{$this->properties->tel}','{$this->properties->fax}','{$this->properties->handy}','{$this->properties->email}','{$this->properties->homepage}','{$this->properties->bemerkung}',".$_SESSION['id_user'].",'".date("Y-m-d")."',true)";
            $action = "neuen Datensatz angelegt";
        }
        else {
            $sql = "UPDATE tbl_partner SET
                    firmenname = '{$this->properties->firmenname}',
                    titel = '{$this->properties->titel}',
                    vorname = '{$this->properties->vorname}',
                    nachname = '{$this->properties->nachname}',
                    adresse = '{$this->properties->adresse}',
                    plz = '{$this->properties->plz}',
                    ort = '{$this->properties->ort}',
                    tel = '{$this->properties->tel}',
                    fax = '{$this->properties->fax}',
                    handy = '{$this->properties->handy}',
                    email = '{$this->properties->email}',
                    homepage = '{$this->properties->homepage}',
                    bemerkung = '{$this->properties->bemerkung}',
                    letzte_bearbeitung = '".date("Y-m-d")."',
                    id_letzter_bearbeiter = ".$_SESSION['id_user']."
                    WHERE id_partner = {$this->properties->id_partner}";
            $action = "Datensatz geändert";
        }
        
        $ergebnis = $db->query($sql);
        if($this->properties->id_partner == 0) $this->properties->id_partner = $db->query("SELECT LAST_INSERT_ID() as neueID")->fetch_object()->neueID;
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Partner',NOW(''),'$action',{$this->properties->id_partner})");
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $sql = "UPDATE tbl_partner SET aktiv=false WHERE id_partner = {$this->properties->id_partner}";
        $ergebnis = $db->query($sql);
        $db->query("INSERT INTO tbl_history (id_user,datenbereich,date,action,id_dataset) VALUES ({$_SESSION['id_user']},'Partner',NOW(''),'Datensatz gelöscht',{$this->properties->id_partner})");
    }
    
    
    //Serialisieren des Objektes als JSON-String
    public function getPropertiesAsJsonObject() 
    {    
        $partner_json = json_encode($this->properties);
        str_replace ("null","\"\"", $partner_json);
        return $partner_json;
    }
}