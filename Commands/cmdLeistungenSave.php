<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdLeistungenSave implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request)&& $auth->authorize())
        {
            $leistung = new Leistungen();
            $leistung->loadByRequest($request);
            $leistung->saveToDatabase($db);
            if($request->getParameter("id_leistungen") == 0) $response->write("{success:true, neueID:{$leistung->getValue("id_leistungen")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }