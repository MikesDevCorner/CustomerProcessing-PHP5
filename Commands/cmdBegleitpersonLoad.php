<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBegleitpersonLoad implements ICommand
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
            $begleitperson = new Begleitperson();
            $begleitperson->loadById($request->getParameter("id_begleitperson"),$db);
            $begleitperson_json = $begleitperson->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$begleitperson_json}");

        } else $response->write("{success:false}");
    }
 }