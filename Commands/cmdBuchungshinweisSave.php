<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungshinweisSave implements ICommand
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

            $sql = "INSERT INTO tbl_buchungshinweis (id_buchung,id_user,hinweis_datum,hinweistext) VALUES ({$request->getParameter("id_buchung")},{$_SESSION['id_user']},'".date("Y-m-d")."','{$request->getParameter("text")}')";
            $db->query($sql);
            
            //Aufbereiten des Responses
            $response->write('({"success":true})');


        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }