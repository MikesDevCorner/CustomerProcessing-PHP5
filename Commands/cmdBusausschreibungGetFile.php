<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusausschreibungGetFile implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request))
        {
            $id_ausschreibung = $request->getParameter("id_ausschreibung");
            $id_busunternehmen = $request->getParameter("id_busunternehmen");
            
            $ausschreibung = new Busausschreibung();
            $ausschreibung->loadById($id_ausschreibung,$db);
            
            $busunternehmen = new Busunternehmen();
            $busunternehmen->loadById($id_busunternehmen,$db);
            
            
            //den SQL-String bauen - bob the sql-builder :)
//            $sql = "SELECT tbl_echtleistungen.id_leistungen, tbl_leistungen.leistungsname, echt_uhrzeit, echt_datum, echt_preis FROM tbl_echtleistungen ";
//            $sql .= "INNER JOIN tbl_leistungen ON tbl_leistungen.id_leistungen = tbl_echtleistungen.id_leistungen WHERE id_buchung = $id_buchung";

            //Abschicken an die Datenbank
//            $ergebnis = $db->query($sql);
//            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
//            while($zeile = $ergebnis->fetch_object())
//            {
//                $arr[] = $zeile;
//            }                        
            $type = $request->getParameter("type");
            $pfad = $ausschreibung->getFile($busunternehmen,$arr,$type,$db);

        } else $response->write("{success:false}");
    }
 }