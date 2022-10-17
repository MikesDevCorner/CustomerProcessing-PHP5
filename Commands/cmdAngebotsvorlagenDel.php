<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenDel implements ICommand
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
            $angebotsvorlagen = new Angebotsvorlagen();
            $angebotsvorlagen->loadById($request->getParameter('id'), $db);
            $angebotsvorlagen->deleteFromDatabase($db);
            $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }