<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBegleitpersonSave implements ICommand
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
            $begleitperson = new Begleitperson();
            $begleitperson->loadByRequest($request);
            $begleitperson->saveToDatabase($db);
            if($request->getParameter("id_begleitperson") == 0) $response->write("{success:true, neueID:{$begleitperson->getValue("id_begleitperson")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }