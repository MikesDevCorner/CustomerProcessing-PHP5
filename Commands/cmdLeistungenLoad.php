<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdLeistungenLoad implements ICommand
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
            $leistung = new Leistungen();
            $leistung->loadById($request->getParameter("id_leistungen"),$db);
            $leistung_json = $leistung->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$leistung_json}");

        } else $response->write("{success:false}");
    }
 }