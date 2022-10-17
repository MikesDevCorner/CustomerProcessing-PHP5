<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAngebotsvorlagenSave implements ICommand
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
            $angebotsvorlagen->loadByRequest($request);
            $angebotsvorlagen->saveToDatabase($db);
            if($request->getParameter("id_angebotsvorlage") == 0) $response->write("{success:true, neueID:{$angebotsvorlagen->getValue("id_angebotsvorlage")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }