<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdReportBa implements ICommand
 {
    public function execute(IRequest $request, IResponse $response)
    {
        //make db-connection
        $db = new DbConnection();
        $response->addHeader("Content-Type","application/json");

        //check if user has permissions to proceed
        $auth = new Auth();
        if ($auth->authenticate($db, $request))
        {
         $usefilter = (bool) ($request->getParameter('usefilter')=='true');
            if($usefilter == true)
            {
                $critcount = 0;
                $regionid = $request->getParameter('searchregionid');
                $regionvon = $request->getParameter('searchregionvon');
                $regionbis = $request->getParameter('searchregionbis');
                $wherecrit = "";

                if($regionid != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND";
                    $wherecrit = $wherecrit."tbl_region_angebotsvorlage.id_region = $regionid ";
                    $critcount++;
                }

                if($regionvon != "" && $regionvon != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_buchungen.datum >= '$regionvon' ";
                    $critcount++;
                }
                if($regionbis != "" && $regionbis != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_buchungen.datum <= '$regionbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
                }
               


         $sql="SELECT DISTINCT
                        tbl_angebotsvorlagen.angebotsname AS Angebot,
                        tbl_buchungen.id_buchung as id_buch,
                        tbl_turnusse.turnus_name AS Turnus,
                        DATE_FORMAT(tbl_buchungen.datum,'%d.%m.%Y') AS DatumStart,
                        DATE_FORMAT(ADDDATE(tbl_buchungen.datum, tbl_turnusse.turnus_dauer -1),'%d.%m.%Y') AS DatumEnde,
                        tbl_turnusse.turnus_dauer AS Tage,
                        ersatz.turnus_name AS Ersatzturnus,
                        tbl_kunde.name_schule AS Schule,
                        tbl_kunde.strasse_schule AS Adresse,
                        tbl_kunde.plz_schule AS Plz,
                        tbl_kunde.ort_schule AS Ort,
                        CONCAT(tbl_begleitperson.vorname, ' ', tbl_begleitperson.nachname) AS Begleitperson,
                        tbl_begleitperson.mobil AS Mobil,
                        CONCAT(tbl_buchungen.anzahl_weiblich + tbl_buchungen.anzahl_maennlich) AS Schueler,
                        CONCAT(tbl_buchungen.anzahl_begleitpers_weiblich + tbl_buchungen.anzahl_begleitpers_maennlich) AS Zahlbegleit,
                        CONCAT(tbl_buchungen.anzahl_weiblich + tbl_buchungen.anzahl_maennlich + tbl_buchungen.anzahl_begleitpers_weiblich + tbl_buchungen.anzahl_begleitpers_maennlich) AS Ges_P,
			tbl_buchungshinweis.hinweistext AS Notiz,
                        tbl_quartiere.quartier_name AS Quartier,
                        tbl_buchungen.buchungs_status AS Status,
                        busse.name_busunternehmen AS Busunternehmen,
                        tbl_busausschreibung.name_fahrer AS Fahrer,
                        tbl_busausschreibung.handy_fahrer AS MobilBus,
                        tbl_busausschreibung.anzahl_personen AS BusPers,
                        tbl_buchungen.preis_bus AS BusPreis,
                        tbl_busausschreibung.id_ausschreibung AS BusID


                FROM    tbl_region INNER JOIN tbl_region_angebotsvorlage ON
                        tbl_region.id_region = tbl_region_angebotsvorlage.id_region
                        INNER JOIN tbl_angebotsvorlagen ON
                        tbl_region_angebotsvorlage.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage
                        INNER JOIN tbl_buchungen ON
                        tbl_angebotsvorlagen.id_angebotsvorlage = tbl_buchungen.id_angebotsvorlage
                        INNER JOIN tbl_begleitperson ON
                        tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson
                        INNER JOIN tbl_kunde ON
                        tbl_begleitperson.id_kunde = tbl_kunde.id_kunde
                        INNER JOIN tbl_anfrage
                        ON tbl_buchungen.id_anfrage = tbl_anfrage.id_anfrage
                        INNER JOIN tbl_turnusse
                        ON tbl_anfrage.id_turnus = tbl_turnusse.id_turnus
                        INNER JOIN tbl_turnusse AS ersatz
                        ON tbl_anfrage.id_ersatzturnus = ersatz.id_turnus
                        LEFT JOIN tbl_buchungshinweis
                        ON tbl_buchungen.id_buchung = tbl_buchungshinweis.id_buchung

                        LEFT JOIN tbl_quartiere ON
                        tbl_buchungen.id_quartier = tbl_quartiere.id_quartier
                        LEFT JOIN

                        (SELECT name_busunternehmen, tbl_busunternehmen_busausschreibung.id_ausschreibung
                        FROM tbl_busunternehmen_busausschreibung
                        INNER JOIN tbl_busunternehmen ON
                        tbl_busunternehmen_busausschreibung.id_busunternehmen = tbl_busunternehmen.id_busunternehmen
                        WHERE gewonnen = 1) AS busse ON

                        tbl_buchungen.id_ausschreibung = busse.id_ausschreibung

                        LEFT JOIN tbl_busausschreibung ON
                        tbl_buchungen.id_ausschreibung = tbl_busausschreibung.id_ausschreibung

                WHERE $wherecrit AND tbl_buchungen.aktiv=1 ORDER BY tbl_buchungen.datum,tbl_busausschreibung.id_ausschreibung";
         
         
                $ergebnis = $db->query($sql);
                $arr = "";
                $i = 0;
                
                if($request->issetParameter("type") && $request->getParameter(("type")) == "excel")
                {
                    require_once 'Resources/PHPExcel/Classes/PHPExcel.php';
                    $objPHPExcel = new PHPExcel();// Set properties
                    $objPHPExcel->getProperties()->setCreator("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setLastModifiedBy("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setTitle("Bearbeitungsliste");
                    $objPHPExcel->getProperties()->setSubject("Bearbeitungsliste");
                    $sheet = $objPHPExcel->setActiveSheetIndex(0);
                    
                    $sheet->getStyle('A1')->getFont()->setBold(true);
                    $sheet->getStyle('B1')->getFont()->setBold(true);
                    $sheet->getStyle('C1')->getFont()->setBold(true);
                    $sheet->getStyle('D1')->getFont()->setBold(true);
                    $sheet->getStyle('E1')->getFont()->setBold(true);
                    $sheet->getStyle('F1')->getFont()->setBold(true);
                    $sheet->getStyle('G1')->getFont()->setBold(true);
                    $sheet->getStyle('H1')->getFont()->setBold(true);
                    $sheet->getStyle('I1')->getFont()->setBold(true);
                    $sheet->getStyle('J1')->getFont()->setBold(true);
                    $sheet->getStyle('K1')->getFont()->setBold(true);
                    $sheet->getStyle('L1')->getFont()->setBold(true);
                    $sheet->getStyle('M1')->getFont()->setBold(true);
                    $sheet->getStyle('N1')->getFont()->setBold(true);
                    $sheet->getStyle('O1')->getFont()->setBold(true);
                    $sheet->getStyle('P1')->getFont()->setBold(true);
                    $sheet->getStyle('Q1')->getFont()->setBold(true);
                    $sheet->getStyle('R1')->getFont()->setBold(true);
                    $sheet->getStyle('S1')->getFont()->setBold(true);
                    $sheet->getStyle('T1')->getFont()->setBold(true);
                    $sheet->getStyle('U1')->getFont()->setBold(true);
                    $sheet->getStyle('V1')->getFont()->setBold(true);
                    $sheet->getStyle('W1')->getFont()->setBold(true);
                    $sheet->getStyle('X1')->getFont()->setBold(true);
                    $sheet->setCellValue('A1',"Angebot");
                    $sheet->setCellValue('B1',"Turnus");
                    $sheet->setCellValue('C1',"DatumStart");
                    $sheet->setCellValue('D1',"DatumEnde");
                    $sheet->setCellValue('E1',"Tage");
                    $sheet->setCellValue('F1',"Ersatzturnus");
                    $sheet->setCellValue('G1',"Schule");
                    $sheet->setCellValue('H1',"Adresse");
                    $sheet->setCellValue('I1',"Plz");
                    $sheet->setCellValue('J1',"Ort");
                    $sheet->setCellValue('K1',"Begleitperson");
                    $sheet->setCellValue('L1',"Mobil");
                    $sheet->setCellValue('M1',"Schueler");
                    $sheet->setCellValue('N1',"Zahlbegleit");
                    $sheet->setCellValue('O1',"Ges_P");
                    $sheet->setCellValue('P1',"Notiz");
                    $sheet->setCellValue('Q1',"Quatier");
                    $sheet->setCellValue('R1',"Status");
                    $sheet->setCellValue('S1',"Busunternehmen");
                    $sheet->setCellValue('T1',"Fahrer");
                    $sheet->setCellValue('U1',"MobilBus");
                    $sheet->setCellValue('V1',"BusPers");
                    $sheet->setCellValue('W1',"BusPreis");
                    $sheet->setCellValue('X1',"BusID");
                    $sheet->setCellValue('Y1',"Zeitplan");
                    
                    $i = 2;
                    while($zeile = $ergebnis->fetch_object())
                    {
                        $sheet->setCellValue('A'.$i,$zeile->Angebot);
                        $sheet->setCellValue('B'.$i,$zeile->Turnus);
                        $sheet->setCellValue('C'.$i,$zeile->DatumStart);
                        $sheet->setCellValue('D'.$i,$zeile->DatumEnde);
                        $sheet->setCellValue('E'.$i,$zeile->Tage);
                        $sheet->setCellValue('F'.$i,$zeile->Ersatzturnus);
                        $sheet->setCellValue('G'.$i,$zeile->Schule);
                        $sheet->setCellValue('H'.$i,$zeile->Adresse);
                        $sheet->setCellValue('I'.$i,$zeile->Plz);
                        $sheet->setCellValue('J'.$i,$zeile->Ort);
                        $sheet->setCellValue('K'.$i,$zeile->Begleitperson);
                        $sheet->setCellValue('L'.$i,$zeile->Mobil);
                        $sheet->setCellValue('M'.$i,$zeile->Schueler);
                        $sheet->setCellValue('N'.$i,$zeile->Zahlbegleit);
                        $sheet->setCellValue('O'.$i,$zeile->Ges_P);
                        $sheet->setCellValue('P'.$i,$zeile->Notiz);
                        $sheet->setCellValue('Q'.$i,$zeile->Quartier);
                        $sheet->setCellValue('R'.$i,$zeile->Status);
                        $sheet->setCellValue('S'.$i,$zeile->Busunternehmen);
                        $sheet->setCellValue('T'.$i,$zeile->Fahrer);
                        $sheet->setCellValue('U'.$i,$zeile->MobilBus);
                        $sheet->setCellValue('V'.$i,$zeile->BusPers);
                        $sheet->setCellValue('W'.$i,$zeile->BusPreis);
                        $sheet->setCellValue('X'.$i,$zeile->BusID);
                        
                        $zeitplan = "";
                        $ergebnis2 = $db->query("SELECT * FROM tbl_echtleistungen INNER JOIN tbl_leistungen ON tbl_echtleistungen.id_leistungen = tbl_leistungen.id_leistungen WHERE id_buchung = {$zeile->id_buch} ORDER BY echt_datum ASC, echt_uhrzeit ASC");
                        while($zeile2 = $ergebnis2->fetch_object())
                        {
                            $zeitplan .= $zeile2->echt_datum . ", " . $zeile2->echt_uhrzeit . " --> ".$zeile2->leistungsname . "\n\r";
                        }
                        $sheet->setCellValue('Y'.$i,$zeitplan);

                        $i++;
                    }
                    
                    
                    $sheet->setTitle('Bearbeitungsliste');
                    $filename = date("Y-m-d G-i")." Bearbeitungsliste ";
        
                    // Redirect output to a clientâ€™s web browser (Excel5)
                    header('Content-Type: application/vnd.ms-excel');
                    header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
                    header('Cache-Control: max-age=0');

                    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                    $objWriter->save('php://output');
                }
                else
                {
                    while($zeile = $ergebnis->fetch_object())
                    {
                        if($i != 0) $arr .= ",";
                        $zeitplan = "";
                        $ergebnis2 = $db->query("SELECT * FROM tbl_echtleistungen INNER JOIN tbl_leistungen ON tbl_echtleistungen.id_leistungen = tbl_leistungen.id_leistungen WHERE id_buchung = {$zeile->id_buch} ORDER BY echt_datum ASC, echt_uhrzeit ASC");
                        while($zeile2 = $ergebnis2->fetch_object())
                        {
                            $zeitplan .= $zeile2->echt_datum . ", " . $zeile2->echt_uhrzeit . " --> ".$zeile2->leistungsname . "<br/>";
                        }                        
                        $arr .= "['".str_replace("'","\'",$zeile->Angebot)."','{$zeile->Turnus}','{$zeile->DatumStart}','{$zeile->DatumEnde}','{$zeile->Tage}','{$zeile->Ersatzturnus}','{$zeile->Schule}','{$zeile->Adresse}','{$zeile->Plz}','{$zeile->Ort}','{$zeile->Begleitperson}','{$zeile->Mobil}','{$zeile->Schueler}','{$zeile->Zahlbegleit}','{$zeile->Ges_P}','".str_replace("'","\'",$zeile->Notiz)."','".str_replace("'","\'",$zeile->Quartier)."','{$zeile->Status}','{$zeile->Busunternehmen}','{$zeile->Fahrer}','{$zeile->MobilBus}','{$zeile->BusPers}','{$zeile->BusPreis}','{$zeile->BusID}','".str_replace("'","\'",$zeitplan)."']";
                        $i++;
                    }
                    $arr = str_replace("\n"," ",$arr);
                    $response->write("{'success':true,'results':[$arr]}");                
                }

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }