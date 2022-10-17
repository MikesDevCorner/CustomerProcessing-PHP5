<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdBuchungSaveBustouren implements ICommand
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
            $id_bustour = $request->getParameter("id_bustour");
            $string_array_buchungen = $request->getParameter("array_buchungen");
            $array_buchungen = explode(",", $string_array_buchungen);
            $db->query("UPDATE tbl_buchungen SET id_ausschreibung = 0 WHERE id_ausschreibung = $id_bustour");
            foreach ($array_buchungen as $buchung)
            {
                $db->query("UPDATE tbl_buchungen SET id_ausschreibung = $id_bustour WHERE id_buchung = $buchung");
            }
            $response->write("{success:true}");

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }