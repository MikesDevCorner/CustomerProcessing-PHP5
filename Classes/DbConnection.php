<?php

include_once("Interfaces".DIRECTORY_SEPARATOR."IDbConnection.php");

class DbConnection implements IDbConnection
{
    protected $link = null;


    public function __construct()
    {
        $config = new SimpleXMLElement("config.xml", 0, true);
        //Verbindung zum Datenbank-Server herstellen (Connection String)
        $this->link = @ new mysqli("{$config->dbHost}", "{$config->dbUser}", "{$config->dbPassword}", '', "{$config->dbPort}");
        //@ unterdr�ckt die Fehlermeldung, wenn Connection nicht erstellt werden kann.
        //$this->link-->connect_error erst ab PHP 5.2.9 unterstützt
        //daher hier die winzige Ausnahme:
        if (mysqli_connect_error()) {
            throw new DBConnectException('Konnte nicht zum Datenbankserver verbinden. Bitte pr�fen Sie die Erreichbarkeit des Selbigen.');
        }
        //Datenbank am Server auswählen
        $this->link->select_db("$config->dbName");
        if ($this->link->errno) {
            throw new DBConnectException('Datenbank konnte nicht ausgewählt werden. Bitte prüfen Sie, ob die Datenbank existiert.');
        }

    }

    public function affected_rows()
    {
        return $this->link->affected_rows;
    }

    public function query($sql)
    {
        $query_result = $this->link->query($sql);
        if ($this->link->errno) {
            throw new DBSQLException("Der SQL-Ausdruck ist falsch. Bitte prüfen Sie die Schreibweise: $sql");
        }
        return $query_result;
    }

    public function real_escape_string($value)
    {
        $res_result = $this->link->real_escape_string($value);
        return $res_result;
    }
}