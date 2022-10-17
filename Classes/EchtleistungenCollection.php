<?php
class EchtleistungenCollection {
    protected $collection = array();
    protected $id_buchung = null;
    
    //Laden des Objektes von Requestdaten des HttpContextes
    public function loadByRequest($request)
    {
        $storeValues = $request->getParameter('storeValues');
        $this->id_buchung = $request->getParameter('id_buchung');
        $datasets = explode("@@",$storeValues);
        $counter = 0;
        foreach($datasets as $dataset)
        {
            $this->collection[$counter] = explode("|",$dataset);
            $counter++;
        }
    }
    
    
    //Persistieren des Objektes in die Datenbank (update und insert)
    public function saveToDatabase($db)
    {
        foreach($this->collection as $row)
        {
            $db->query("INSERT INTO tbl_echtleistungen (id_buchung,id_leistungen,echt_uhrzeit,echt_datum) VALUES ({$this->id_buchung},{$row[0]},'{$row[1]}','{$row[2]}')");
        }
    }
    
    
    //Setzen des aktiv-Flags in der Datenbank auf false
    public function deleteFromDatabase($db)
    {   
        $db->query("DELETE FROM tbl_echtleistungen WHERE id_buchung = {$this->id_buchung}");
    }
    
}