<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdReportQuartiere implements ICommand
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
                $quartierid = $request->getParameter('searchquartierid');
                $quartiervon = $request->getParameter('searchquartiervon');
                $quartierbis = $request->getParameter('searchquartierbis');
                $wherecrit = "";

                if($quartierid != "")
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND";
                    $wherecrit = $wherecrit."tbl_quartiere.id_quartier = $quartierid ";
                    $critcount++;
                }

                if($quartiervon != "" && $quartiervon != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_buchungen.datum >= '$quartiervon' ";
                    $critcount++;
                }
                if($quartierbis != "" && $quartierbis != 'undefined')
                {
                    if($critcount != 0) $wherecrit = $wherecrit."AND ";
                    $wherecrit = $wherecrit."tbl_buchungen.datum <= '$quartierbis' ";
                    $critcount++;
                }
                if($critcount==0) $wherecrit = "";
                }
               


         $sql="SELECT DISTINCT 
                        tbl_quartiere.quartier_name,
                        tbl_kunde.name_schule,
                        CONCAT(tbl_begleitperson.vorname,' ',tbl_begleitperson.nachname) AS begleitperson,
                        tbl_begleitperson.mobil AS handy,
                        tbl_angebotsvorlagen.angebotsname,
                        DATE_FORMAT(tbl_buchungen.datum,'%d.%b') AS turnus_start,
                        DATE_FORMAT(ADDDATE(tbl_buchungen.datum, tbl_turnusse.turnus_dauer -1),'%d.%b.%Y') AS turnus_ende,
                        tbl_buchungen.anzahl_weiblich AS sw,
                        tbl_buchungen.anzahl_maennlich AS sm,
                        CONCAT(tbl_buchungen.anzahl_weiblich + tbl_buchungen.anzahl_maennlich) AS schueler,
                        tbl_buchungen.anzahl_begleitpers_weiblich AS bw,
                        tbl_buchungen.anzahl_begleitpers_maennlich AS bm,
                        CONCAT(tbl_buchungen.anzahl_begleitpers_weiblich + tbl_buchungen.anzahl_begleitpers_maennlich) AS zahlbegleit,
                        tbl_buchungen.anzahl_vegetarier AS vegi,
                        tbl_buchungen.anzahl_muslime AS musl


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
                    $objPHPExcel->getProperties()->setTitle("Report nach Quartiere");
                    $objPHPExcel->getProperties()->setSubject("Report nach Quartiere");
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
                    $sheet->setCellValue('A1',"Quartier");
                    $sheet->setCellValue('B1',"Schule");
                    $sheet->setCellValue('C1',"Begleitperson");
                    $sheet->setCellValue('D1',"Handy");
                    $sheet->setCellValue('E1',"Angebotsname");
                    $sheet->setCellValue('F1',"Anreise");
                    $sheet->setCellValue('G1',"Abreise");
                    $sheet->setCellValue('H1',"Sch-W");
                    $sheet->setCellValue('I1',"Sch-M");
                    $sheet->setCellValue('J1',"Sch-Ges.");
                    $sheet->setCellValue('K1',"Begl-W");
                    $sheet->setCellValue('L1',"Begl-M");
                    $sheet->setCellValue('M1',"Begl-Ges.");
                    $sheet->setCellValue('N1',"Vegi");
                    $sheet->setCellValue('O1',"Muslime");
                    
                    $i = 2;
                    while($zeile = $ergebnis->fetch_object())
                    {
                        $sheet->setCellValue('A'.$i,$zeile->quartier_name);
                        $sheet->setCellValue('B'.$i,$zeile->name_schule);
                        $sheet->setCellValue('C'.$i,$zeile->begleitperson);
                        $sheet->setCellValue('D'.$i,$zeile->handy);
                        $sheet->setCellValue('E'.$i,$zeile->angebotsname);
                        $sheet->setCellValue('F'.$i,$zeile->turnus_start);
                        $sheet->setCellValue('G'.$i,$zeile->turnus_ende);
                        $sheet->setCellValue('H'.$i,$zeile->sw);
                        $sheet->setCellValue('I'.$i,$zeile->sm);
                        $sheet->setCellValue('J'.$i,$zeile->schueler);
                        $sheet->setCellValue('K'.$i,$zeile->bw);
                        $sheet->setCellValue('L'.$i,$zeile->bm);
                        $sheet->setCellValue('M'.$i,$zeile->zahlbegleit);
                        $sheet->setCellValue('N'.$i,$zeile->vegi);
                        $sheet->setCellValue('O'.$i,$zeile->musl);
                        $i++;
                    }
                    
                    
                    $sheet->setTitle('Report nach Quartiere');
                    $filename = date("Y-m-d G-i")." Report nach Quartiere ";
        
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
                        $arr .= "['{$zeile->quartier_name}','{$zeile->name_schule}','{$zeile->begleitperson}','{$zeile->handy}','{$zeile->angebotsname}','{$zeile->turnus_start}','{$zeile->turnus_ende}','{$zeile->sw}','{$zeile->sm}','{$zeile->schueler}','{$zeile->bw}','{$zeile->bm}','{$zeile->zahlbegleit}','{$zeile->vegi}','{$zeile->musl}']";
                        $i++;
                    }
                    $response->write("{'success':true,'results':[$arr]}");                
                }

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }