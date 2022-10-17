<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusunternehmenDel implements ICommand
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
            $busunternehmen = new Busunternehmen();
            $busunternehmen->loadById($request->getParameter('id'), $db);
            $busunternehmen->deleteFromDatabase($db);
            $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }