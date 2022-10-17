<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusunternehmenLoad implements ICommand
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
            $busunternehmen = new Busunternehmen();
            $busunternehmen->loadById($request->getParameter("id_busunternehmen"),$db);
            $busunternehmen_json = $busunternehmen->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$busunternehmen_json}");

        } else $response->write("{success:false}");
    }
 }