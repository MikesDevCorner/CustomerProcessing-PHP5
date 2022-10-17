<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusausschreibungLoad implements ICommand
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
            $busausschreibung = new Busausschreibung();
            $busausschreibung->loadById($request->getParameter("id_ausschreibung"),$db);
            $busausschreibung_json = $busausschreibung->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$busausschreibung_json}");

        } else $response->write("{success:false}");
    }
 }