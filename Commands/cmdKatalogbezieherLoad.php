<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKatalogbezieherLoad implements ICommand
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
            $katalogbezieher = new Katalogbezieher();
            $katalogbezieher->loadById($request->getParameter("id_katalogbezieher"),$db);
            $katalogbezieher_json = $katalogbezieher->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$katalogbezieher_json}");

        } else $response->write("{success:false}");
    }
 }