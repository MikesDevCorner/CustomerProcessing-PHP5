<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKundeSave implements ICommand
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
            $kunde = new Kunde();
            $kunde->loadByRequest($request);
            $kunde->saveToDatabase($db);
            if($request->getParameter("id_kunde") == 0) $response->write("{success:true, neueID:{$kunde->getValue("id_kunde")}}");
            else $response->write("{success:true}");
            
        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }