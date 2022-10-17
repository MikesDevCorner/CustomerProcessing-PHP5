<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdTurnusseSave implements ICommand
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
            $turnus = new Turnusse();
            $turnus->loadByRequest($request);
            $turnus->saveToDatabase($db);
            if($request->getParameter("id_turnus") == 0) $response->write("{success:true, neueID:{$turnus->getValue("id_turnus")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }