<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdUserGetList implements ICommand
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
            
            $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $userid = (int) $request->getParameter('searchid');
                $username = $request->getParameter('searchusername');
                $nachname = $request->getParameter('searchnachname');
                $archiv = (int) ($request->getParameter('searcharchiv')!='false');
                $wherecrit = "WHERE ";
                if($archiv == 0)
                {
                    $wherecrit = $wherecrit."aktiv = true ";
                    $critcount++;
                }
                if($userid != 0)
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."id_user = $userid ";
                    $critcount++;
                }
                if($username != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."username like '%$username%' ";
                    $critcount++;
                }
                if($nachname != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."nachname like '%$nachname%' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }
            else
            {
                $wherecrit = "where aktiv = true";
            }
            

            //den SQL-String bauen - bob the sql-builder :)
            $sql = "select id_user as id, username, vorname, nachname,tbl_user.aktiv FROM tbl_user";
            $sql .= " $wherecrit ORDER BY id_user DESC limit $start,$limit";
            $sql_anzahl = "select count(id_user) as anzahl from tbl_user $wherecrit";

            //Abschicken an die Datenbank
            $ergebnis = $db->query($sql);
            $zeilen = $db->affected_rows();

            $arr = array();
            //alle Zeilen der SQL-SELECT Anweisung nacheinander in ein Array fetchen
            while($zeile = $ergebnis->fetch_object())
            {
                $zeile->icon="<img src='Resources/images/16x16/users.png' alt='pic' />";
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