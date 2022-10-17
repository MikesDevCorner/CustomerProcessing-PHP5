<?php
 include_once("Interfaces/ICommand.php");
 
 class cmdReport1 implements ICommand
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
                        DATE_FORMAT(tbl_buchungen.datum,'%d.%m.%Y') AS DatumStart,
                        DATE_FORMAT(ADDDATE(tbl_buchungen.datum, tbl_turnusse.turnus_dauer -1),'%d.%m.%Y') AS DatumEnde,
                        tbl_turnusse.turnus_dauer AS Tage,
                        tbl_kunde.name_schule AS Schule,
                        tbl_kunde.strasse_schule AS Adresse,
                        tbl_kunde.plz_schule AS Plz,
                        tbl_kunde.ort_schule AS Ort,
                        CONCAT(tbl_begleitperson.vorname, ' ', tbl_begleitperson.nachname) AS Begleitperson,
                        tbl_begleitperson.mobil AS Mobil,
                        tbl_buchungen.anzahl_weiblich AS W,
                        tbl_buchungen.anzahl_maennlich AS M,
                        tbl_buchungen.anzahl_begleitpers_weiblich AS LW,
                        tbl_buchungen.anzahl_begleitpers_maennlich AS LM,
                        tbl_buchungen.anzahl_vegetarier AS Vegi,
                        tbl_buchungen.anzahl_muslime AS Muslime,
                        tbl_quartiere.quartier_name AS Quartier,
                        tbl_buchungen.buchungs_status AS Status,
                        tbl_buchungen.aktiv,
                        busse.name_busunternehmen AS Busunternehmen
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
                        LEFT JOIN tbl_quartiere ON
                        tbl_buchungen.id_quartier = tbl_quartiere.id_quartier
                        LEFT JOIN

                        (SELECT name_busunternehmen, tbl_busunternehmen_busausschreibung.id_ausschreibung
                        FROM tbl_busunternehmen_busausschreibung
                        INNER JOIN tbl_busunternehmen ON
                        tbl_busunternehmen_busausschreibung.id_busunternehmen = tbl_busunternehmen.id_busunternehmen
                        WHERE gewonnen = 1) AS busse ON

                        tbl_buchungen.id_ausschreibung = busse.id_ausschreibung
            
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
                    $objPHPExcel->getProperties()->setTitle("Report nach Region");
                    $objPHPExcel->getProperties()->setSubject("Report nach Region");
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
                    $sheet->setCellValue('A1',"Angebot");
                    $sheet->setCellValue('B1',"DatumStart");
                    $sheet->setCellValue('C1',"DatumEnde");
                    $sheet->setCellValue('D1',"Tage");
                    $sheet->setCellValue('E1',"Schule");
                    $sheet->setCellValue('F1',"Begleitperson");
                    $sheet->setCellValue('G1',"Adresse");
                    $sheet->setCellValue('H1',"Plz");
                    $sheet->setCellValue('I1',"Ort");
                    $sheet->setCellValue('J1',"Mobil");
                    $sheet->setCellValue('K1',"W");
                    $sheet->setCellValue('L1',"M");
                    $sheet->setCellValue('M1',"LW");
                    $sheet->setCellValue('N1',"LM");
                    $sheet->setCellValue('O1',"Vegi");
                    $sheet->setCellValue('P1',"Muslime");
                    $sheet->setCellValue('Q1',"Quatier");
                    $sheet->setCellValue('R1',"Status");
                    $sheet->setCellValue('S1',"Busunternehmen");
                    
                    $i = 2;
                    while($zeile = $ergebnis->fetch_object())
                    {
                        $sheet->setCellValue('A'.$i,$zeile->Angebot);
                        $sheet->setCellValue('B'.$i,$zeile->DatumStart);
                        $sheet->setCellValue('C'.$i,$zeile->DatumEnde);
                        $sheet->setCellValue('D'.$i,$zeile->Tage);
                        $sheet->setCellValue('E'.$i,$zeile->Schule);
                        $sheet->setCellValue('F'.$i,$zeile->Begleitperson);
                        $sheet->setCellValue('G'.$i,$zeile->Adresse);
                        $sheet->setCellValue('H'.$i,$zeile->Plz);
                        $sheet->setCellValue('I'.$i,$zeile->Ort);
                        $sheet->setCellValue('J'.$i,$zeile->Mobil);
                        $sheet->setCellValue('K'.$i,$zeile->W);
                        $sheet->setCellValue('L'.$i,$zeile->M);
                        $sheet->setCellValue('M'.$i,$zeile->LW);
                        $sheet->setCellValue('N'.$i,$zeile->LM);
                        $sheet->setCellValue('O'.$i,$zeile->Vegi);
                        $sheet->setCellValue('P'.$i,$zeile->Muslime);
                        $sheet->setCellValue('Q'.$i,$zeile->Quartier);
                        $sheet->setCellValue('R'.$i,$zeile->Status);
                        $sheet->setCellValue('S'.$i,$zeile->Busunternehmen);
                        $i++;
                    }
                    
                    
                    $sheet->setTitle('Report nach Region');
                    $filename = date("Y-m-d G-i")." Report nach Region ";
        
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
                        $arr .= "['{$zeile->Angebot}','{$zeile->DatumStart}','{$zeile->DatumEnde}','{$zeile->Tage}','{$zeile->Schule}','{$zeile->Adresse}','{$zeile->Plz}','{$zeile->Ort}','{$zeile->Begleitperson}','{$zeile->Mobil}','{$zeile->W}','{$zeile->M}','{$zeile->LW}','{$zeile->LM}','{$zeile->Vegi}','{$zeile->Muslime}','{$zeile->Quartier}','{$zeile->Status}','{$zeile->Busunternehmen}']";
                        $i++;
                    }
                    $response->write("{'success':true,'results':[$arr]}");                
                }

        } else $response->write("{'success':false,'message':'Keine Schreibrechte.'}");
    }
 }