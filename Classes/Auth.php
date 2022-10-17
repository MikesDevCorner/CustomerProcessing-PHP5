<?php

include_once("Interfaces".DIRECTORY_SEPARATOR."IAuth.php");

class Auth implements IAuth {

    public function authenticate(IDbConnection $db, IRequest $request) {
        if (isset($_SESSION["valid_user"]))
        {
            return true;
        }
        else
        {
            $username = $request->getParameter("username");
            $passwort = $request->getParameter("passwort");

            if ( $username && $passwort ) {

                $sql = "SELECT username, CONCAT(vorname,' ',nachname) as printname, schreiberecht, id_user FROM tbl_user
                WHERE username='$username'
                and passwort=md5('$passwort')
                and aktiv = true";

                $ergebnis = $db->query($sql);

                $zeilen = $db->affected_rows();
                $userdata = $ergebnis->fetch_object();

                if ( $zeilen == 1 ) {
                    //alle für die Session relevanten Daten in dieser Session speichern und somit für die restlichen
                    //Files abrufbar machen...
                    $_SESSION['valid_user'] = $userdata->username;
                    $_SESSION['schreiberecht'] = $userdata->schreiberecht;
                    $_SESSION['printname'] = $userdata->printname;
                    $_SESSION['id_user'] = $userdata->id_user;
                    //Rückgabewert der Funktion ist true, wenn der Datenbankcall eine valide Zeile ergeben hat.
                    return true;
                } else return false;
            } else return false;
        }
    }
    
    public function authorize() {
        return $_SESSION['schreiberecht'];        
    }
}