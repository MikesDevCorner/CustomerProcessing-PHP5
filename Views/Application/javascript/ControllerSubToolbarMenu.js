ControllerSubToolbarMenu = function()
{
    this.tmpComponent;

    this.AssignComponent = function(component)
    {
        this.tmpComponent = component;
    }

    this.GetComponent = function()
    {
        return this.tmpComponent;
    }

    this.Init = function()
    {
            
    }

    this.SetListeners = function()
    {
                
        Ext.getCmp('btn_dashboard').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'),
            new Ext.ux.MainPanelDashboard({
                id:'panel_dashboard'
            }));
        });
        

        Ext.getCmp('btn_anfragen').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'),
            new Ext.ux.MainPanelAnfragen({
                id:'panel_anfragen'
            }));
        });

        Ext.getCmp('btn_buchungen').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelBuchungen({
                id:'panel_buchungen'
            }));
        });
        
        Ext.getCmp('btn_ausschreibungen').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelBustouren({
                id:'panel_ausschreibungen'
            }));
        });
        
        Ext.getCmp('btn_kunden').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelKunden({
                id:'panel_kunden'
            }));
        });

        Ext.getCmp('btn_katalogbezieher').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelKatalogbezieher({
                id:'panel_katalogbezieher'
            }));
        });

        Ext.getCmp('btn_turnusse').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelTurnusse({
               id:'panel_turnusse'
            }));
        });

        Ext.getCmp('btn_partner').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelPartner({
                id:'panel_partner'
            }));
        });

        Ext.getCmp('btn_leistungen').on('click', function(){
                    Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelLeistungen({
                        id:'panel_leistungen'
                    }));
                });

        Ext.getCmp('btn_angebotsvorlagen').on('click', function(){
                    Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelAngebotsvorlagen({
                        id:'panel_angebotsvorlagen'
                    }));
                });
                

        Ext.getCmp('btn_quartiere').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelQuartiere({
                id:'panel_quartiere'
            }));
        });


         Ext.getCmp('btn_busunternehmen').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelBusunternehmen({
                id:'panel_busunternehmen'
            }));
        });

        Ext.getCmp('btn_regionen').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelRegionen({
                id:'panel_regionen'
            }));
        });

        Ext.getCmp('btn_users').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelUser({
                id:'panel_user'
            }));
        });
        
        Ext.getCmp('btn_buchungenPartner').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelReport2({
                id:'panel_report2'
            }));
        });
        
        Ext.getCmp('btn_buchungenRegion').on('click', function(){
            Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelReport1({
                id:'panel_report1'
            }));
        });

         Ext.getCmp('btn_buchungsbestaetigung').on('click', function(){
                    Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelReportBu({
                        id:'panel_reportbu'
                    }));
        });

         Ext.getCmp('btn_buchungQuartiere').on('click', function(){
                    Application.changeView(Ext.getCmp('anzeigebereich'), new Ext.ux.MainPanelReportQuartiere({
                        id:'panel_reportquartiere'
                    }));
        });

        Ext.getCmp('btn_logout').on('click', function(){
            Ext.Ajax.request({
                url: 'index.php',
                params:{
                    cmd:'Logout'
                },
                method: 'POST',
                success:function(response,options){
                    //Wenn der Logout-Command ohne Probleme durchgelaufen ist, ist der Success-Code auf true.
                    //danach wird die Seite neu geladen und es wird der Anmeldeschirm angezeigt.
                    if(Ext.decode(response.responseText).success == true)
                    {
                        self.location='index.php';
                    } else Ext.Msg.alert('Logout Error', 'Sie wurden nicht vollständig ausgeloggt. Bitte Seite erneut laden und nochmals ausloggen!');
                },
                failure:function() {
                    Ext.Msg.alert('Logout Error', 'Der Server wurde nicht erreicht. Bitte versuchen Sie später nochmals sich auszuloggen.');
                }
            });
        });

    }
}