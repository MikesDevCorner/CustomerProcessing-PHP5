<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungLoad implements ICommand
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
            $buchung = new Buchung();
            $buchung->loadById($request->getParameter("id_buchung"),$db);
            $buchung_json = $buchung->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$buchung_json}");

        } else $response->write("{success:false}");
    }
 }