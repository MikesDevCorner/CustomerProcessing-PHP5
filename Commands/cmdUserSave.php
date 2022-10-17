<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdUserSave implements ICommand
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
            $appuser = new User();
            $appuser->loadByRequest($request);
            $appuser->saveToDatabase($db);
            if($request->getParameter("id_user") == 0) $response->write("{success:true, neueID:{$appuser->getValue("id_user")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }