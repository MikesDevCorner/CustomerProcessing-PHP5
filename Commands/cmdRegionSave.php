<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdRegionSave implements ICommand
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
            $region = new Region();
            $region->loadByRequest($request);
            $region->saveToDatabase($db);
            if($request->getParameter("id_region") == 0) $response->write("{success:true, neueID:{$region->getValue("id_region")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }