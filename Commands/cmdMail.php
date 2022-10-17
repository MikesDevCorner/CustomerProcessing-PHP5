<?php
 include_once("Interfaces/ICommand.php");
 include("Resources/PHPMailer/class.phpmailer.php");
 
 class cmdMail implements ICommand {
    public function execute(IRequest $request, IResponse $response) {

        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request)&& $auth->authorize())
        {

            if ( session_is_registered( "valid_user" ) ) $from = $_SESSION['valid_user'];
            else $from = "office@jugend-aktiv.info";

            $to = $request->getParameter('to');

            $mail = new PHPMailer();

            $mail->IsSMTP();                            // set mailer to use SMTP
            $mail->Host = "mailrelay.pronet.at";        // specify main and backup server
            $mail->SMTPSecure = "SSL";
            $mail->Port = 587;
            $mail->SMTPAuth = false;                        // turn on SMTP authentication
            $mail->Username = "office@jugend-aktiv.info";    // SMTP username
            $mail->Password = "77Gtofp5";            // SMTP password

            $mail->From = $from;    //do NOT fake header.
            $mail->FromName = "Sachbearbeiter Jugend Aktiv";
            $mail->AddAddress($to);
            $mail->AddReplyTo($from, "Support and Help"); //optional

            $mail->Subject = $request->getParameter('subject');
            $mail->Body    = $request->getParameter('body');

            if(!$mail->Send())
            {
               throw new Exception($mail->ErrorInfo);
            }else{
               $response->write("{success:true}");
            }
        }
    }
 }