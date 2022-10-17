<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdNoCommand implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
       $response->write("{'success':false,'message':'Server-Command nicht gefunden. Bitte prüfen Sie die Service-API.'}");
    }
 }