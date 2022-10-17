<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenLoad implements ICommand
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
            $angebotsvorlagen = new Angebotsvorlagen();
            $angebotsvorlagen->loadById($request->getParameter("id_angebotsvorlage"),$db);
            $angebotsvorlagen_json = $angebotsvorlagen->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$angebotsvorlagen_json}");

        } else $response->write("{success:false}");
    }
 }