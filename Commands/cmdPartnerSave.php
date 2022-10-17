<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdPartnerSave implements ICommand
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
            $partner = new Partner();
            $partner->loadByRequest($request);
            $partner->saveToDatabase($db);
            if($request->getParameter("id_partner") == 0) $response->write("{success:true, neueID:{$partner->getValue("id_partner")}}");
            else $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }