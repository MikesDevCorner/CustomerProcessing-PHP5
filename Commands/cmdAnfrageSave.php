<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdAnfrageSave implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        //if (Auth::authenticate($db, $request)&& Auth::authorize())
        //{
            $anfrage = new Anfrage();
            $anfrage->loadByRequest($request);
            $anfrage->saveToDatabase($db);
            if($request->getParameter("id_anfrage") == 0) $response->write("{success:true, neueID:{$anfrage->getValue("id_anfrage")}}");
            else $response->write("{success:true}");

        //} else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }