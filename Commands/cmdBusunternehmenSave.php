<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBusunternehmenSave implements ICommand
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
            $busunternehmen->loadByRequest($request);
            $busunternehmen->saveToDatabase($db);
            if($request->getParameter("id_busunternehmen") == 0) $response->write("{success:true, neueID:{$busunternehmen->getValue("id_busunternehmen")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }