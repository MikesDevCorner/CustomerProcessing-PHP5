<?php
//die Interfacebeschreibung f�r den Request soll bzw. muss so gehalten sein,
//  dass sie nicht nur den HTTP-Request abdeckt, sondern auch z.B. einen XML-Request.

//Die Festlegung von Interfaces erfordert einen Weitblick bez�glich der m�glichen
//  Anwendungsbreite einer Anwendung, sowie technische Detailkenntnisse bez�glich notwendiger Methoden
//  im Interface.

//Alle Kommentare im Interface-Abschnitt beziehen sich nur auf die Verwendung beim HTTP-Request.

	interface IRequest {
		
		//Liefere alle Keys des $_POST Arrays zur�ck
		public function getParameterNames();
		
		//Pr�fe, ob es diesen Key ($name) am $_POST Array gibt
		public function issetParameter($name);
		
		//Entferne einen Eintrag im $_POST Array. Der Eintrag hat den Key $name.
		public function unsetParameter($name);
		
		//hohle den Wert zum Key ($name) aus dem $_POST Array
		public function getParameter($name);
		
		//Liefere einen Eintrag aus dem HTTP-Header. 
		//$name ist ein Key aus $_SERVER 
		public function getHeader($name);
	}
