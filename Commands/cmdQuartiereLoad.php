<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdQuartiereLoad implements ICommand
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
            $quartiere = new Quartiere();
            $quartiere->loadById($request->getParameter("id_quartier"),$db);
            $quartiere_json = $quartiere->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$quartiere_json}");

        } else $response->write("{success:false}");
    }
 }