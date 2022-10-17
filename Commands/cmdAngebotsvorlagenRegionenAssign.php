<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenRegionenAssign implements ICommand
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

            $sql = "DELETE FROM tbl_region_angebotsvorlage WHERE id_angebotsvorlage = $id_angebotsvorlage";
            $ergebnis = $db->query($sql);
            $array = substr($array, 0, (strlen($array)-1));
            $arr = explode(",",$array);
            foreach ($arr as $value) {
                $id_region = $value;
                $db->query("INSERT INTO tbl_region_angebotsvorlage (id_angebotsvorlage,id_region) VALUES ($id_angebotsvorlage,$id_region)");
            }
            $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }