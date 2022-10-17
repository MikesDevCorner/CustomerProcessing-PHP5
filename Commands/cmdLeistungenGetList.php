<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdLeistungenGetList implements ICommand
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
            
            if($request->issetParameter("mode") && $request->getParameter("mode") == "lookup" )
            {
                $ergebnis = $db->query("SELECT id_leistungen AS id, leistungsname AS leistung FROM tbl_leistungen");
                $arr = array();
                while($zeile = $ergebnis->fetch_object())  $arr[] = $zeile;
                $data = json_encode($arr);
                $response->write('({"results":' . $data . '})');
            }
            else
            {
                $start = (integer) $request->getParameter('start');
                $limit = (integer) $request->getParameter('limit');
                $query = $request->getParameter('query');
                
                $usefilter = (bool) ($request->getParameter('usefilter')=='true');
                
                if($usefilter == true)
                {
                    $critcount = 0;
                    $leistungsname = $request->getParameter('searchleistungsname');
                    $partner = $request->getParameter('searchpartner');
                    $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                    $wherecrit = "WHERE ";
                    if($archiv == 0)
                    {
                        $wherecrit = $wherecrit."tbl_leistungen.aktiv = true ";
                        $critcount++;
                    }
                    if($leistungsname != "")
                    {
                        if($critcount != 0) $wherecrit = $wherecrit."AND ";
                        $wherecrit = $wherecrit."leistungsname like '%$leistungsname%' ";
                        $critcount++;
                    }
                    if($partner != "")
                    {
                        if($critcount != 0) $wherecrit = $wherecrit."AND ";
                        $wherecrit = $wherecrit."firmenname like '%$partner%' ";
                        $critcount++;
                    }
                    if($critcount==0) $wherecrit = "";
                }
                else
                {
                    $wherecrit = "where tbl_leistungen.aktiv = true AND tbl_leistungen.leistungsname LIKE '%$query%'";
                }

                //den SQL-String bauen - bob the sql-builder :)
                $sql = "select id_leistungen AS id, leistungsname AS leistung, tbl_leistungen.id_partner, tbl_partner.firmenname,tbl_leistungen.aktiv FROM tbl_leistungen INNER JOIN tbl_partner ON tbl_leistungen.id_partner = tbl_partner.id_partner $wherecrit ORDER BY tbl_leistungen.id_leistungen DESC limit $start,$limit";
                $sql_anzahl = "select count(id_leistungen) as anzahl from tbl_leistungen INNER JOIN tbl_partner ON tbl_leistungen.id_partner = tbl_partner.id_partner $wherecrit";

                //Abschicken an die Datenbank
                $ergebnis = $db->query($sql);
                $zeilen = $db->affected_rows();

                $arr = array();

                //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
                while($zeile = $ergebnis->fetch_object())
                {
                    $zeile->icon="<img src='Resources/images/16x16/product16.png' alt='pic' />";
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
            }

        } else $response->write("{success:false}");
    }
 }