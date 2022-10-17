<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenLeistungenAssign implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request)&& $auth->authorize())
        {
            $id_angebotsvorlage = $request->getParameter("id_angebotsvorlage");
            $array = $request->getParameter("array");

            $sql = "DELETE FROM tbl_angebotsvorlage_leistungen WHERE id_angebotsvorlage = $id_angebotsvorlage";
            $ergebnis = $db->query($sql);
            $array = substr($array, 0, (strlen($array)-1));
            $arr = explode(",",$array);
            foreach ($arr as $value) {
                $leistungTagCombi = explode("|",$value);
                $id_leistung = $leistungTagCombi[0];
                $leistungstag = $leistungTagCombi[1];
                $ergebnis = $db->query("INSERT INTO tbl_angebotsvorlage_leistungen (id_angebotsvorlage,id_leistungen,leistungstag) VALUES ($id_angebotsvorlage,$id_leistung,$leistungstag)");
            }
            $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }