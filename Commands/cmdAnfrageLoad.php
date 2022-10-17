<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAnfrageLoad implements ICommand
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
            $anfrage = new Anfrage();
            $anfrage->loadById($request->getParameter("id_anfrage"),$db);
            $anfrage_json = $anfrage->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$anfrage_json}");

        } else $response->write("{success:false}");
    }
 }