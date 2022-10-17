<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdPartnerGetList implements ICommand
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
                $ergebnis = $db->query("SELECT id_partner AS id, firmenname FROM tbl_partner");
                $arr = array();
                while($zeile = $ergebnis->fetch_object())  $arr[] = $zeile;
                $data = json_encode($arr);
                $response->write('({"results":' . $data . '})');
            }
            else
            {
            //Werte für Paging
            $start = (integer) $request->getParameter('start');
            $limit = (integer) $request->getParameter('limit');
            $query = $request->getParameter('query');

            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $firmenname = $request->getParameter('searchfirmenname');
                $nachname = $request->getParameter('searchnachname');
                $plz = $request->getParameter('searchplz');
                $ort = $request->getParameter('searchort');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."aktiv = true ";
                    $critcount++;
                }
                if($firmenname != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."firmenname like '%$firmenname%' ";
                    $critcount++;
                }
                if($nachname != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."nachname like '%$nachname%' ";
                    $critcount++;
                }
                if($plz != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."plz like '%$plz%' ";
                    $critcount++;
                }
                if($ort != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."ort like '%$ort%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where aktiv = true AND firmenname LIKE '%$query%'";
            }
            
            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_partner AS id, firmenname, nachname, plz, ort,tbl_partner.aktiv FROM tbl_partner $wherecrit ORDER BY firmenname ASC limit $start,$limit";
            $sql_anzahl = "select count(id_partner) as anzahl from tbl_partner $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();

            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/user.png' alt='pic' />";
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