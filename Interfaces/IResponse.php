<?php
//Warum wird eine Schnittstelle zum Senden von Daten an den Client verwendet?
//Ist nicht die Verwendung von print oder echo wesentlich einfacher?
// - Vorteil
//    - Die Daten k�nnen vor dem Versenden zentralisiert ver�ndert werden
//		Beispiel: 	Anstelle von Antwort an den Browser wird eine XML-Datei an ein
//					Webservice geschickt.

	interface IResponse {
		
		//Mit setStatus werden im Header-Teil des HTTP-Protokolls Statusmeldungen platziert
		//z.B. 200 ok, 404 not found
		public function setStatus($status);
		
		//Mit addHeader werden die Statusangaben tats�chlich in den Protokollheader eingef�gt 
		public function addHeader($name, $value);
		
		//Die an den Client zu sendenden Daten werden als Objekteigenschaftswert zwischengespeichert
		//die write-Methode beschifkt diesen Eigenschaftswert.
		public function write($data);
		
		//die flush-Methode macht mit dem Abschicken ernst. Mit flush wird der �ber write() angesammelte Eigenschafts-
		//wert und alle Header abgeschickt.
		public function flush();  
	}
