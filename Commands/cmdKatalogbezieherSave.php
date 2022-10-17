<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdKatalogbezieherSave implements ICommand
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
            $katalogbezieher = new Katalogbezieher();
            $katalogbezieher->loadByRequest($request);
            $katalogbezieher->saveToDatabase($db);
            if($request->getParameter("id_katalogbezieher") == 0) $response->write("{success:true, neueID:{$katalogbezieher->getValue("id_katalogbezieher")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }