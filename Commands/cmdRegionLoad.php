<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdRegionLoad implements ICommand
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
            $region = new Region();
            $region->loadById($request->getParameter("id_region"),$db);
            $region_json = $region->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$region_json}");

        } else $response->write("{success:false}");
    }
 }