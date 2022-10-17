<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdDashboard implements ICommand
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
            if($request->getParameter("mode")=="buchungenRegion")
            {
                $ergebnis = $db->query("SELECT tbl_region.id_region as id, tbl_region.name_region as name, count(tbl_buchungen.id_buchung) as anzahl FROM tbl_buchungen
                INNER JOIN tbl_region_angebotsvorlage ON tbl_buchungen.id_angebotsvorlage = tbl_region_angebotsvorlage.id_angebotsvorlage
                INNER JOIN tbl_region ON tbl_region_angebotsvorlage.id_region = tbl_region.id_region
                GROUP BY tbl_region.id_region ORDER BY count(tbl_buchungen.id_buchung) DESC limit 0,4");
                $arr = array();
                while($zeile = $ergebnis->fetch_object()) $arr[] = $zeile;
                $data = json_encode($arr);
                $response->write("{'success':true,'results':$data}");
            }
            
            if($request->getParameter("mode")=="buchungenKunde")
            {
                $ergebnis = $db->query("SELECT tbl_kunde.name_schule as name, count(tbl_buchungen.id_buchung) as anzahl FROM tbl_buchungen
                INNER JOIN tbl_begleitperson ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson
                INNER JOIN tbl_kunde ON tbl_kunde.id_kunde = tbl_begleitperson.id_kunde
                GROUP BY tbl_begleitperson.id_kunde ORDER BY count(tbl_buchungen.id_buchung) DESC limit 0,4");
                $arr = array();
                while($zeile = $ergebnis->fetch_object()) $arr[] = $zeile;
                $data = json_encode($arr);
                $response->write("{'success':true,'results':$data}");
            }
            
            
            if($request->getParameter("mode")=="buchungenMonate")
            {
                $ergebnis = $db->query("SELECT MONTHNAME(datum) as month,YEAR(datum) as year, count(id_buchung) as anzahl
                FROM tbl_buchungen GROUP BY YEAR(datum),MONTH(datum) ORDER BY datum ASC limit 0,5");
                $arr = array();
                while($zeile = $ergebnis->fetch_object()) {
                    $zeile->name = $zeile->month.' '. $zeile->year;
                    $arr[] = $zeile;
                }
                $data = json_encode($arr);
                $response->write("{'success':true,'results':$data}");
            }
            
            
            if($request->getParameter("mode")=="buchungenJahr")
            {
                $ergebnis = $db->query("SELECT YEAR(datum) as name, count(id_buchung) as anzahl
                FROM tbl_buchungen GROUP BY YEAR(datum) ORDER BY datum ASC limit 0,5");
                $arr = array();
                while($zeile = $ergebnis->fetch_object()) $arr[] = $zeile;
                $data = json_encode($arr);
                $response->write("{'success':true,'results':$data}");
            }
            
                
            if($request->getParameter("mode")=="allgemein")
            {
                $ergebnis = $db->query("SELECT buchungs_status, count(id_buchung) as anzahl FROM tbl_buchungen WHERE aktiv = 1 GROUP BY buchungs_status ORDER BY buchungs_status ASC");
                $arr = array();
                while($zeile = $ergebnis->fetch_object()) $arr[$zeile->buchungs_status] = $zeile->anzahl;
                $anzBuchung = "0";
                $anzBuchungGebucht = "0";
                $anzBuchungBest = "0";
                $anzBuchungAbg = "0";
                if(isset($arr["bestätigt"])) $anzBuchungBest = $arr["bestätigt"];
                if(isset($arr["gebucht"])) $anzBuchungGebucht = $arr["gebucht"];
                if(isset($arr["abgeschlossen"])) $anzBuchungAbg = $arr["abgeschlossen"];
                $ergebnis = $db->query("SELECT count(id_buchung) as anzahl FROM tbl_buchungen");
                $anzBuchung = $ergebnis->fetch_object()->anzahl;
                $ergebnis = $db->query("SELECT count(id_buchung) as anzahl FROM tbl_buchungen WHERE aktiv = 0");
                $anzBuchungArchiv = $ergebnis->fetch_object()->anzahl;
                $buchungen = "'anzBuchung':$anzBuchung,'anzBuchungGebucht':$anzBuchungGebucht,'anzBuchungBest':$anzBuchungBest,'anzBuchungAbg':$anzBuchungAbg,'anzBuchungArchiv':$anzBuchungArchiv";


                $ergebnis = $db->query("SELECT count(id_anfrage) as anzahl FROM tbl_anfrage");
                $anzAnfragen = $ergebnis->fetch_object()->anzahl;
                $ergebnis = $db->query("SELECT count(id_anfrage) as anzahl FROM tbl_anfrage WHERE aktiv = 1");
                $anzAnfragenunb = $ergebnis->fetch_object()->anzahl;
                $anfragen = "'anzAnfragen':$anzAnfragen,'anzAnfragenunb':$anzAnfragenunb";


                $ergebnis = $db->query("SELECT count(id_ausschreibung) as anzahl FROM tbl_busausschreibung WHERE datum > NOW() AND aktiv = 1");
                $anzAusschreibungen = $ergebnis->fetch_object()->anzahl;
                $ergebnis = $db->query("SELECT count(tbl_busausschreibung.id_ausschreibung) as anzahl FROM tbl_busausschreibung INNER JOIN tbl_busunternehmen_busausschreibung ON tbl_busunternehmen_busausschreibung.id_ausschreibung = tbl_busausschreibung.id_ausschreibung WHERE tbl_busausschreibung.datum > NOW() AND tbl_busausschreibung.aktiv = 1 AND tbl_busunternehmen_busausschreibung.gewonnen = 1");
                $anzAusschreibungenSieger = $ergebnis->fetch_object()->anzahl;
                $ergebnis = $db->query("SELECT count(id_ausschreibung) as anzahl FROM tbl_busausschreibung");
                $anzAusschreibungenInsg = $ergebnis->fetch_object()->anzahl;

                $ausschreibungen = "'anzAusschreibungen':$anzAusschreibungen,'anzAusschreibungenSieger':$anzAusschreibungenSieger,'anzAusschreibungenInsg':$anzAusschreibungenInsg";
                $response->write("{'success':true,'user':'{$_SESSION["printname"]}','schreiben':{$_SESSION["schreiberecht"]},$buchungen,$anfragen,$ausschreibungen}");
            }

        } else $response->write("{success:false}");
    }
 }