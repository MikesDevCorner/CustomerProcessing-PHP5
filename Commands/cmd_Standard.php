<?php
 include_once("Interfaces/ICommand.php");

 class cmd_Standard implements ICommand {

    private $config;

    public function execute(IRequest $request, IResponse $response) {
    //Der Standard-Command ist der Command, der als erstes vom FrontController aufgerufen wird
    //und entscheidet, welche weiteren Schritte passieren sollen.
    //Entweder es wird die Application gestartet, falls noch keine Server-Session besteht wird der Login für
    //diese Applikation, oder es wird ein Fehler ausgegeben.

        //Wir definieren den Seitenaufruf als "nicht-ajax" Aufruf, damit wir in der Fehlerbehandlung
        //mitbekommen, ob es ein Ajax oder Nicht-Ajax Seitenaufruf war.
        //so ist es viel einfacher, als jedem Ajax-Aufruf ein Attribut ajax zu schenken.
        $request->setParameter('nonajax', true);
        $response->addHeader("Content-Type","text/html");
        $this->config = new SimpleXMLElement("config.xml",0,true);
		
        //make db-connection and user-security
        $db = new DbConnection();
        $this->config->version = $db->query("SELECT version FROM tbl_changelog ORDER BY date DESC limit 0,1")->fetch_object()->version;

        //Wenn Help als Variable gesetzt ist, wird die Hilfe aufgerufen
        if(isset($_GET['help'])) {
            $this->Help($response);
        }
        else
        {
            //Wenn Meldermaske als Variable gesetzt ist, wird die Meldermaske aufgerufen
            if(isset($_GET['meldermaske'])) {
                if(isset($_GET['unstyled'])) $this->MeldermaskeUnstyled($response);
                else if (isset($_GET['homepage'])) $this->MeldermaskeHomepage($response);
                    else $this->Meldermaske($response);
            }
            else
            {
                $auth = new Auth();
                if ($auth->authenticate($db, $request)) {
                    $this->Application($response);
                } else {
                    if($request->issetParameter('username') && $request->issetParameter('passwort')) {
                        $text = "<FONT style='color:red;'>Leider stimmen Ihre Anmeldeinformationen nicht mit unserer Datenbank überein. Bitte versuchen Sie es erneut!</FONT>";
                    } else {
                        $text = "Willkommen in der Administration von {$this->config->title}! Bitte loggen Sie sich ein um fortzufahren...";
                    }
                    $this->LoginForm($text, $response, $request);
                }
            }
        }
    }
    
  

    private function Help($response) {
        $view = new TemplateView('Hilfe');
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->render($response);
    }


    private function Meldermaske($response) {
        $view = new TemplateView('Meldermaske');
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->assign('logo',$this->config->logo);
        $view->render($response);
    }
    
    
    private function MeldermaskeUnstyled($response) {
        $view = new TemplateView('MeldermaskeUnstyled');
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->assign('logo',$this->config->logo);
        $view->render($response);
    }
	
	
	private function MeldermaskeHomepage($response) {
        $view = new TemplateView('MeldermaskeHomepage');
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->assign('logo',$this->config->logo);
        $view->render($response);
    }


    private function Application($response) {
        $view = new TemplateView('Application');
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->assign('logo',$this->config->logo);
        $view->assign('session',session_id());
        $view->render($response);
    }


    private function LoginForm($message, $response, $request) {
        $view = new TemplateView('LoginForm');
        $view->assign('message',$message);
        $view->assign('version',$this->config->version);
        $view->assign('title',$this->config->title);
        $view->assign('logo',$this->config->logo);
        $view->render($response);
    }
 }