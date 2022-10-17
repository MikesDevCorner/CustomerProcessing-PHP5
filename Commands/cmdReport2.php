<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdReport2 implements ICommand
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
                $partnerid = $request->getParameter('searchpartnerid');
                $partnervon = $request->getParameter('searchpartnervon');
                $partnerbis = $request->getParameter('searchpartnerbis');
                $wherecrit = "";

                if($partnerid != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND";
                    $wherecrit = $wherecrit."tbl_partner.id_partner = $partnerid ";
                    $critcount++;
                }

                if($partnervon != "" && $partnervon != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_echtleistungen.echt_datum >= '$partnervon' ";
                    $critcount++;
                }
                if($partnerbis != "" && $partnerbis != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_echtleistungen.echt_datum <= '$partnerbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
            }

         $sql="SELECT
                        tbl_partner.firmenname AS Partner,
                        tbl_leistungen.leistungsname AS Leistung,
                        DATE_FORMAT(tbl_echtleistungen.echt_datum,'%d.%m.%Y') AS Datum,
                        tbl_echtleistungen.echt_uhrzeit AS Uhrzeit,
                        tbl_angebotsvorlagen.angebotsname AS Angebot,
                        tbl_kunde.name_schule AS Schule,
                        CONCAT(tbl_begleitperson.nachname, ' ', tbl_begleitperson.vorname) AS Begleitperson,
                        tbl_begleitperson.mobil AS Handy,
                        tbl_buchungen.anzahl_weiblich AS S_W,
                        tbl_buchungen.anzahl_maennlich AS S_M,
                        tbl_buchungen.anzahl_begleitpers_weiblich AS L_W,
                        tbl_buchungen.anzahl_begleitpers_maennlich AS L_M,
                        CONCAT(tbl_buchungen.anzahl_weiblich+tbl_buchungen.anzahl_maennlich+tbl_buchungen.anzahl_begleitpers_weiblich+tbl_buchungen.anzahl_begleitpers_maennlich) AS Gesamtpersonen,
                        tbl_buchungen.anzahl_vegetarier AS Vegi,
                        tbl_buchungen.anzahl_muslime AS Muslime,
                        tbl_buchungen.buchungs_status AS Status

                FROM	tbl_partner INNER JOIN tbl_leistungen ON
                        tbl_partner.id_partner = tbl_leistungen.id_partner
                        INNER JOIN tbl_echtleistungen ON
                        tbl_leistungen.id_leistungen = tbl_echtleistungen.id_leistungen
                        INNER JOIN tbl_buchungen ON
                        tbl_echtleistungen.id_buchung = tbl_buchungen.id_buchung
                        INNER JOIN tbl_angebotsvorlagen ON
                        tbl_buchungen.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage
                        INNER JOIN tbl_begleitperson ON
                        tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson
                        INNER JOIN tbl_kunde ON
                        tbl_begleitperson.id_kunde = tbl_kunde.id_kunde

                WHERE $wherecrit AND tbl_buchungen.aktiv=1 ORDER BY tbl_echtleistungen.echt_datum";


                $ergebnis = $db->query($sql);
                $arr = "";
                $i = 0;

                if($request->issetParameter("type") && $request->getParameter(("type")) == "excel")
                {
                    require_once 'Resources/PHPExcel/Classes/PHPExcel.php';
                    $objPHPExcel = new PHPExcel();// Set properties
                    $objPHPExcel->getProperties()->setCreator("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setLastModifiedBy("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setTitle("Report nach Partner");
                    $objPHPExcel->getProperties()->setSubject("Report nach Partner");
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
                    $sheet->setCellValue('A1',"Partner");
                    $sheet->setCellValue('B1',"Leistung");
                    $sheet->setCellValue('C1',"Datum");
                    $sheet->setCellValue('D1',"Uhrzeit");
                    $sheet->setCellValue('E1',"Angebot");
                    $sheet->setCellValue('F1',"Schule");
                    $sheet->setCellValue('G1',"Begleitperson");
                    $sheet->setCellValue('H1',"Handy");
                    $sheet->setCellValue('I1',"S_W");
                    $sheet->setCellValue('J1',"S_M");
                    $sheet->setCellValue('K1',"L_W");
                    $sheet->setCellValue('L1',"L_M");
                    $sheet->setCellValue('M1',"Gesamtpersonen");
                    $sheet->setCellValue('N1',"Vegi");
                    $sheet->setCellValue('O1',"Muslime");
                    $sheet->setCellValue('P1',"Status");

                    $i = 2;
                    while($zeile = $ergebnis->fetch_object())
                    {
                        $sheet->setCellValue('A'.$i,$zeile->Partner);
                        $sheet->setCellValue('B'.$i,$zeile->Leistung);
                        $sheet->setCellValue('C'.$i,$zeile->Datum);
                        $sheet->setCellValue('D'.$i,$zeile->Uhrzeit);
                        $sheet->setCellValue('E'.$i,$zeile->Angebot);
                        $sheet->setCellValue('F'.$i,$zeile->Schule);
                        $sheet->setCellValue('G'.$i,$zeile->Begleitperson);
                        $sheet->setCellValue('H'.$i,$zeile->Handy);
                        $sheet->setCellValue('I'.$i,$zeile->S_W);
                        $sheet->setCellValue('J'.$i,$zeile->S_M);
                        $sheet->setCellValue('K'.$i,$zeile->L_W);
                        $sheet->setCellValue('L'.$i,$zeile->L_M);
                        $sheet->setCellValue('M'.$i,$zeile->Gesamtpersonen);
                        $sheet->setCellValue('N'.$i,$zeile->Vegi);
                        $sheet->setCellValue('O'.$i,$zeile->Muslime);
                        $sheet->setCellValue('P'.$i,$zeile->Status);
                        $i++;
                    }


                    $sheet->setTitle('Report nach Partner');
                    $filename = date("Y-m-d G-i")." Report nach Partner ";

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
                        $arr .= "['".str_replace("'","\'",$zeile->Partner)."','".str_replace("'","\'",$zeile->Leistung)."','{$zeile->Datum}','{$zeile->Uhrzeit}','{$zeile->Angebot}','{$zeile->Schule}','{$zeile->Begleitperson}','{$zeile->Handy}','{$zeile->S_W}','{$zeile->S_M}','{$zeile->L_W}','{$zeile->L_M}','{$zeile->Gesamtpersonen}','{$zeile->Vegi}','{$zeile->Muslime}','{$zeile->Status}']";
                        $i++;
                    }
                    $response->write("{'success':true,'results':[$arr]}");
                }

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }