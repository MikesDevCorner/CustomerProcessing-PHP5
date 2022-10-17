<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title><?php print $this->title.' '.$this->version; ?></title>
        <link rel="stylesheet" type="text/css" href="Resources/ext3/resources/css/ext-all.css" />
        <link rel="stylesheet" type="text/css" href="Resources/ext3/examples/shared/examples.css" />
        <link rel="stylesheet" type="text/css" href="Resources/ext3/resources/css/xtheme-blue.css" />
        <link rel="stylesheet" type="text/css" href="Views/Application/css/application.css" />
        <link rel="stylesheet" type="text/css" href="Resources/ext3/examples/ux/css/Portal.css" />
    </head>
    <body>
        <div id="loading">
            <div class="loading-indicator">
                <img src="Resources/images/loading.gif" id="loadingDiv" alt="loading" />
                <?php print $this->title.' '.$this->version; ?><br />
                <span id="loading-msg">Styles und Images werden geladen...</span>
            </div>
        </div>

        <!-- Einbinden der Framework-Javascripts-->
        <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Laden der Grund-Bibliotheken...';</script>
        <script type="text/javascript" src="Resources/ext3/adapter/ext/ext-base.js"></script>
        <script type="text/javascript" src="Resources/ext3/ext-all.js"></script>

        
        <!-- Einbinden der noch benötigten Framework-Extensions -->
        <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Laden der UI-Extensions...';</script>
        <script type="text/javascript" src="Resources/ext3/examples/ux/xdatefield.js"></script>
        <script type="text/javascript" src="Resources/ext3/examples/ux/RowExpander.js"></script>
        <script type="text/javascript" src="Resources/ext3/examples/ux/Portal.js"></script>
        <script type="text/javascript" src="Resources/ext3/examples/ux/PortalColumn.js"></script>
        <script type="text/javascript" src="Resources/ext3/examples/ux/Portlet.js"></script>
        <script type="text/javascript" src="Resources/ext3/examples/shared/examples.js"></script>

        
        <!-- Einbinden der eigenen Javascripts-->
        <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Laden der Applikation...';</script>
        <script type="text/javascript" src="Views/Application/javascript/ApplicationLibrary.js"></script>
        <script type="text/javascript">Application.sessionId = '<?php print $this->session;?>';</script>
        <script type="text/javascript">Application.version = '<?php print $this->version;?>';</script>
        <script type="text/javascript">Application.title = '<?php print $this->title;?>';</script>
        <script type="text/javascript">Application.logo = '<?php print $this->logo;?>';</script>

        <!--Controller für Subelemente (Hilfscode für konkrete Implementierungen der Subelemente) -->
        <script type="text/javascript" src="Views/Application/javascript/ControllerSubToolbarMenu.js"></script>

        <!--Subelemente sind Klassen, welche als Bauteile für diverse Funktionen dienen-->
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubFormPanelModel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubFormPanelModelSimple.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubContainerPanelModel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubGridAuswahlModel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubToolbarMenu.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.SubPanelSuche.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.WindowTakeOver.js"></script>
        
        
        <!--Controller für Anfragen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerAnfrageFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerAnfrageGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerAnfragePanelSuche.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerWindowTakeOver.js"></script>

        <!--Controller für User-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerUserFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerUserGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerUserPanelSuche.js"></script>

        <!--Controller für Partner-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerPartnerFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerPartnerGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerPartnerPanelSuche.js"></script>
        
        <!--Controller für Kunden-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerKundenContainerPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerKundenGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerKundenPanelSuche.js"></script>

         <!--Controller für Katalogbezieher-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerKatalogbezieherFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerKatalogbezieherGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerKatalogbezieherPanelSuche.js"></script>

        <!--Controller für Turnusse-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerTurnusseFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerTurnusseGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerTurnussePanelSuche.js"></script>

        <!--Controller für Leistungen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerLeistungenFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerLeistungenGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerLeistungenPanelSuche.js"></script>

         <!--Controller für Qaurtiere-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerQuartiereFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerQuartiereGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerQuartierePanelSuche.js"></script>

        <!--Controller für Angebotsvorlagen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerAngebotsvorlagenFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerAngebotsvorlagenGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerAngebotsvorlagenPanelSuche.js"></script>

        <!--Controller für Regionen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerRegionFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerRegionGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerRegionPanelSuche.js"></script>

        <!--Controller für Busunternehmen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerBusunternehmenFormPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBusunternehmenGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBusunternehmenPanelSuche.js"></script>
        
        <!--Controller für Buchungen-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerBuchungContainerPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBuchungGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBuchungPanelSuche.js"></script>
        
        <!--Controller für Bustour-->
        <script type="text/javascript" src="Views/Application/javascript/ControllerBustourContainerPanel.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBustourGridAuswahl.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/ControllerBustourPanelSuche.js"></script>

         <!--Mainpanels sind die Panels, die direkt in den Anzeigenbereich gerendert weden können-->
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelAnfragen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelBuchungen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelPartner.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelLeistungen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelAngebotsvorlagen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelRegionen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelBusunternehmen.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelUser.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelKunden.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelTurnusse.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelBustouren.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelKatalogbezieher.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelDashboard.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelReport1.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelReport2.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelQuartiere.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelReportBu.js"></script>
        <script type="text/javascript" src="Views/Application/javascript/Ext.ux.MainPanelReportQuartiere.js"></script>
        
        <!--Schlussendlich der Aufruf der Applikation-->
        <script type="text/javascript" src="Views/Application/javascript/Application.js"></script>
       
    </body>
</html>