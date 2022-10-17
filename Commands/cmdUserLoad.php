<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdUserLoad implements ICommand
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
            $appuser = new User();
            $appuser->loadById($request->getParameter("id_user"),$db);
            $user_json = $appuser->getPropertiesAsJsonObject();
            $response->write("{\"success\": true, \"data\":$user_json}");

        } else $response->write("{success:false}");
    }
 }