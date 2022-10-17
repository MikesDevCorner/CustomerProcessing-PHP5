<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdPartnerLeistungenGetList implements ICommand
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
            //Werte für Paging
            $start = (integer) $request->getParameter('start');
            $limit = (integer) $request->getParameter('limit');
            $query = $request->getParameter('query');
            //Unterscheidung, ob ALLE (Archiv) oder nur die offenen Anfragen geladen werden
            //$archiv = $request->getParameter('archiv');
            if($query != "")
            {
                $sql = "select id_partner, firmenname as partner
                        from tbl_partner
                        WHERE aktiv = true AND firmenname LIKE '%$query%' ORDER BY partner ASC limit $start,$limit";
                $sql_anzahl = "select count(id_partner) as anzahl from tbl_partner where aktiv = true AND firmenname LIKE '%$query%'";
            }
            else
            {
                //den SQL-String bauen - bob the sql-builder :)
                $sql = "select id_partner, firmenname as partner
                        from tbl_partner 
                        WHERE aktiv = true ORDER BY partner ASC limit $start,$limit";
                $sql_anzahl = "select count(id_partner) as anzahl from tbl_partner where aktiv = true";
            }
            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/inventory-maintenance16.png' alt='pic' />";
                $arr[] = $zeile;
            }
            $data = json_encode($arr);

            $ergebnis_anzahl = $db->query($sql_anzahl);
            $anzahl = $ergebnis_anzahl->fetch_object()->anzahl;

            //Aufbereiten des Responses
            if($zeilen == 0) $response->write('({"total":"0","results":[]})');
            else $response->write('({"total":"' . $anzahl . '","results":' . $data . '})');

            //Freigeben von Variablen
            $ergebnis->free();
            $ergebnis_anzahl->free();

        } else $response->write("{success:false}");
    }
 }