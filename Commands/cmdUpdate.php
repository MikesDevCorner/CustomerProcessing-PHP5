<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdUpdate implements ICommand {
    public function execute(IRequest $request, IResponse $response) {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request)&& $auth->authorize())
        {

            $table = $request->getParameter('table');
            $key = $request->getParameter('key');
            $id = (integer)$db->real_escape_string($request->getParameter('keyID'));
            $field = $request->getParameter('field');
            $value = $db->real_escape_string($request->getParameter('value'));
            $now = date("Y-m-d");

            //welcher User ist momentan als valider User angemeldet...
            $userid = $_SESSION['id_user'];
            //Der tatsächliche Update der DB mit den neuen Werten.
            if(is_string($request->getParameter('value'))AND $value != 'true' AND $value != 'false') 
            {
                $db->query('UPDATE '.$table.' SET '.$field.'= \''.$value.'\' WHERE '.$key.'='.$id);
            }
            else 
            {
                $db->query('UPDATE '.$table.' SET '.$field.'= '.$value.' WHERE '.$key.'='.$id);
            }

            $rows = $db->affected_rows();

            if($rows > 0) {
            //ID des angemeldeten Users und das aktuelle Datum zu diesem Datensatz dazuspeichern.

            $db->query("UPDATE ".$table." SET id_letzter_bearbeiter = $userid WHERE ".$key.' = '.$id);
            $db->query("UPDATE ".$table.' SET letzte_bearbeitung = \''.$now.'\' WHERE '.$key.' = '.$id);
            $response->write("{success:true}");

            } else throw new DBSQLException('Kein Datensatz wurde upgedated. Bitte prüfen Sie den SQL-Ausdruck!');

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }

 }