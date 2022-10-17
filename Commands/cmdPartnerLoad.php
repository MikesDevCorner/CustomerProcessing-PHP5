<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdPartnerLoad implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request))
        {
            $partner = new Partner();
            $partner->loadById($request->getParameter("id_partner"),$db);
            $partner_json = $partner->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$partner_json}");

        } else $response->write("{success:false}");
    }
 }