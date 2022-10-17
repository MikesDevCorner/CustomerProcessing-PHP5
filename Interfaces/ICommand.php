<?php
//Leitidee: Jede Seite im Webspace wird zu einem Command
//Ausgenommen davon ist eine einzige Seite - der zentrale Einstiegspunkt
//  Unter PHP am Apache Webserver ist der typische Name dieser Seite index.php

//Das Commandinterface spezifiziert die Anforderung an Klassen,
//die f�r Seiteninhalte zust�ndig sind.

//Vorteil:
// - Neue Commandklassen k�nnen mit geringer Abh�ngigkeit hinzugef�gt werden
// - Bestehende Commandklassen k�nnen ohne gro�e Tiefen- und Breitenwirkung
//   ausgetauscht werden.

interface ICommand {
    public function execute(IRequest $request, IResponse $response);
}