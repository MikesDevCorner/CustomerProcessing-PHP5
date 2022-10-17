<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdTurnusseLoad implements ICommand
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
            $turnus = new Turnusse();
            $turnus->loadById($request->getParameter("id_turnus"),$db);
            $turnus_json = $turnus->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$turnus_json}");

        } else $response->write("{success:false}");
    }
 }