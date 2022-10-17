<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungSave implements ICommand
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
            $buchung = new Buchung();
            $buchung->loadByRequest($request);
            $buchung->saveToDatabase($db);
            if($request->getParameter("id_buchung") == 0) 
            {
                $buchung->copyEchtleistungen($db);    
                $response->write("{success:true, neueID:{$buchung->getValue("id_buchung")}}");
            }
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }