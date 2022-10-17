<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdReportBu implements ICommand
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
                        tbl_kunde.name_schule,
                        CONCAT(tbl_begleitperson.vorname,' ',tbl_begleitperson.nachname) AS begleitperson,
                        tbl_kunde.strasse_schule,
                        tbl_kunde.plz_schule,
                        tbl_kunde.ort_schule,
                        tbl_angebotsvorlagen.angebotsname,
                        DATE_FORMAT(tbl_buchungen.datum,'%d.%b.%Y') AS datum,
                        DATE_FORMAT(ADDDATE(tbl_buchungen.datum, tbl_turnusse.turnus_dauer -1),'%d.%b.%Y') AS turnus_ende,
                        CONCAT(tbl_buchungen.anzahl_weiblich + tbl_buchungen.anzahl_maennlich) AS schueler,
                        CONCAT(tbl_buchungen.anzahl_begleitpers_weiblich + tbl_buchungen.anzahl_begleitpers_maennlich) AS zahlbegleit,
                        tbl_quartiere.quartier_name,
                        TIME_FORMAT(tbl_buchungen.abfahrtszeit_schule,'%H:%i') AS abfahrtszeit_schule,
                        TIME_FORMAT(tbl_buchungen.ankunftszeit_schule,'%H:%i') AS ankunftszeit_schule,
                        tbl_buchungen.preis_schueler,
                        tbl_buchungen.preis_begleit,
                        tbl_buchungen.preis_bus
                FROM
                        tbl_buchungen INNER JOIN tbl_begleitperson
                        ON tbl_buchungen.id_erste_ansprechperson = tbl_begleitperson.id_begleitperson
                        INNER JOIN tbl_kunde
                        ON tbl_begleitperson.id_kunde = tbl_kunde.id_kunde
                        INNER JOIN tbl_angebotsvorlagen
                        ON tbl_buchungen.id_angebotsvorlage = tbl_angebotsvorlagen.id_angebotsvorlage
                        INNER JOIN tbl_region_angebotsvorlage
                        ON tbl_angebotsvorlagen.id_angebotsvorlage = tbl_region_angebotsvorlage.id_angebotsvorlage
                        INNER JOIN tbl_region
                        ON tbl_region_angebotsvorlage.id_region = tbl_region.id_region
                        INNER JOIN tbl_anfrage
                        ON tbl_buchungen.id_anfrage = tbl_anfrage.id_anfrage
                        INNER JOIN tbl_turnusse
                        ON tbl_anfrage.id_turnus = tbl_turnusse.id_turnus
                        LEFT JOIN tbl_quartiere
                        ON tbl_buchungen.id_quartier = tbl_quartiere.id_quartier

                WHERE $wherecrit AND tbl_buchungen.aktiv=1 ORDER BY tbl_buchungen.datum";
         
         
                $ergebnis = $db->query($sql);
                $arr = "";
                $i = 0;
                
                if($request->issetParameter("type") && $request->getParameter(("type")) == "excel")
                {
                    require_once 'Resources/PHPExcel/Classes/PHPExcel.php';
                    $objPHPExcel = new PHPExcel();// Set properties
                    $objPHPExcel->getProperties()->setCreator("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setLastModifiedBy("Jugend Aktiv");
                    $objPHPExcel->getProperties()->setTitle("Report nach Buchungen");
                    $objPHPExcel->getProperties()->setSubject("Report nach Buchungen");
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
                    $sheet->setCellValue('A1',"Schule");
                    $sheet->setCellValue('B1',"Ansprechperson");
                    $sheet->setCellValue('C1',"Adresse");
                    $sheet->setCellValue('D1',"Plz");
                    $sheet->setCellValue('E1',"Ort");
                    $sheet->setCellValue('F1',"Angebotsname");
                    $sheet->setCellValue('G1',"Von");
                    $sheet->setCellValue('H1',"Bis");
                    $sheet->setCellValue('I1',"Quartier");
                    $sheet->setCellValue('J1',"Schüler");
                    $sheet->setCellValue('K1',"Begleit");
                    $sheet->setCellValue('L1',"Abfahrtszeit");
                    $sheet->setCellValue('M1',"Ankunftszeit");
                    $sheet->setCellValue('N1',"Preis Schueler");
                    $sheet->setCellValue('O1',"Preis Begleit");
                    $sheet->setCellValue('P1',"Preis Bus");
                    
                    $i = 2;
                    while($zeile = $ergebnis->fetch_object())
                    {
                        $sheet->setCellValue('A'.$i,$zeile->name_schule);
                        $sheet->setCellValue('B'.$i,$zeile->begleitperson);
                        $sheet->setCellValue('C'.$i,$zeile->strasse_schule);
                        $sheet->setCellValue('D'.$i,$zeile->plz_schule);
                        $sheet->setCellValue('E'.$i,$zeile->ort_schule);
                        $sheet->setCellValue('F'.$i,$zeile->angebotsname);
                        $sheet->setCellValue('G'.$i,$zeile->datum);
                        $sheet->setCellValue('H'.$i,$zeile->turnus_ende);
                        $sheet->setCellValue('I'.$i,$zeile->quartier_name);
                        $sheet->setCellValue('J'.$i,$zeile->schueler);
                        $sheet->setCellValue('K'.$i,$zeile->zahlbegleit);
                        $sheet->setCellValue('L'.$i,$zeile->abfahrtszeit_schule);
                        $sheet->setCellValue('M'.$i,$zeile->ankunftszeit_schule);
                        $sheet->setCellValue('N'.$i,$zeile->preis_schueler);
                        $sheet->setCellValue('O'.$i,$zeile->preis_begleit);
                        $sheet->setCellValue('P'.$i,$zeile->preis_bus);
						$sheet->getStyle('N'.$i)->getNumberFormat()->setFormatCode("#,##0.00");
                        $sheet->getStyle('O'.$i)->getNumberFormat()->setFormatCode("#,##0.00");
                        $sheet->getStyle('P'.$i)->getNumberFormat()->setFormatCode("#,##0.00");
                        $i++;
                    }
                    
                    
                    $sheet->setTitle('Report nach Buchungen');
                    $filename = date("Y-m-d G-i")." Report nach Buchungen ";
        
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
                        $arr .= "['{$zeile->name_schule}','{$zeile->begleitperson}','{$zeile->strasse_schule}','{$zeile->plz_schule}','{$zeile->ort_schule}','{$zeile->angebotsname}','{$zeile->datum}','{$zeile->turnus_ende}','{$zeile->quartier_name}','{$zeile->schueler}','{$zeile->zahlbegleit}','{$zeile->abfahrtszeit_schule}','{$zeile->ankunftszeit_schule}','{$zeile->preis_schueler}','{$zeile->preis_begleit}','{$zeile->preis_bus}']";
                        $i++;
                    }
                    $response->write("{'success':true,'results':[$arr]}");                
                }

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }