<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKundeLoad implements ICommand
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
            $kunde = new Kunde();
            $kunde->loadById($request->getParameter("id_kunde"),$db);
            $kunde_json = $kunde->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$kunde_json}");

        } else $response->write("{success:false}");
    }
 }