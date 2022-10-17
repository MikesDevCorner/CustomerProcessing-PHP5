ControllerBuchungGridAuswahl = function()
{
    var controller = this;
    
    this.tmpComponent;

    this.AssignComponent = function(component)
    {
        this.tmpComponent = component;
    }

    this.GetComponent = function()
    {
        return this.tmpComponent;
    }

    this.LoadData = function()
    {
        
    }

    this.Init = function()
    {
        
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Buchungen</b>");
        Ext.getCmp('btn_add').hide();
        //Ext.getCmp('btn_delete').hide();
    }

    this.SetListeners = function()
    {        
        this.tmpComponent.getStore().on('beforeload', function(store, options) { 
            Ext.each(Ext.getCmp('suchpanel').items.items, function(item) {
               options.params[item.getName()] = item.getValue();
            });
            options.params.usefilter = Application.UseFilter;
        });


        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Buchung mit der Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', Schule '+controller.tmpComponent.getSelectionModel().getSelected().data.name_schule+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'BuchungDel',
                                   id: controller.tmpComponent.getSelectionModel().getSelected().data.id
                               },
                               success: function(response,options) {
                                   var jsonResp = Ext.decode(response.responseText);
                                   if(jsonResp.success)
                                        controller.tmpComponent.getStore().reload();
                                   else Ext.example.msg('Fehler','Fehler beim Löschen ist aufgetreten: '+jsonResp.message);
                               },
                               failure: function(response,options) {
                                   Ext.example.msg('Fehler','Fehler beim Löschen ist aufgetreten.');
                               }
                            });
                       }
                   },
                   icon: Ext.MessageBox.QUESTION
                });
            }
            else {Ext.example.msg('Hinweis', 'Bitte wählen Sie einen Datensatz zum Löschen aus.');}
        });


        this.tmpComponent.on('rowclick', function(grid,rowIndex){
            var AP1 = Ext.getCmp('buchungAp1');
            var AP2 = Ext.getCmp('buchungAp2');
            
            Ext.getCmp('buchungsKundenDaten').getForm().reset();
            AP1.getForm().reset();
            AP2.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue('');
            var buchungForm = Ext.getCmp('buchungForm');
            var formArea = Ext.getCmp('formarea');
            buchungForm.Controller.enableAllChilds();
            buchungForm.Controller.enableAllToolbarButtons();
            Ext.getCmp('echtleistungAdd').enable();
            Ext.getCmp('echtleistungDel').enable();
            Ext.getCmp('notizAddButton').enable();
            Ext.getCmp('bustourForm').getForm().reset();

            Ext.StoreMgr.get('zeitpunkteStore').load({params:{cmd:'EchtleistungenGetList',id_buchung:grid.getStore().getAt(rowIndex).id}});

            formArea.getForm().load({
                url: 'index.php',
                success: function(form,action) {
                    var resp = Ext.decode(action.response.responseText);
                    Ext.getCmp('zeitplanpanel').setTitle("Zeitplan - "+resp.data.angebotsname);
                    
                    Ext.getCmp('cmbQuartier').setValue("");
                    Ext.StoreMgr.get('quartierStore').load({
                        params:{idBuchung:resp.data.id_buchung},
                        callback: function() {
                            Ext.getCmp('cmbQuartier').setValue(resp.data.id_quartier);
                        }
                    });                    
                    
                    Ext.getCmp('buchungAp1').getForm().load({
                        url: 'index.php',
                        success: function(form,action) {
                            var responseData = Ext.decode(action.response.responseText);
                            Ext.getCmp('buchungsKundenDaten').getForm().load({
                                url: 'index.php',
                                success: function(response,options) {},
                                failure: function() {
                                    Ext.example.msg('Error', 'Fehler beim Laden der Kundendaten.');
                                },
                                method: 'POST',
                                params: {
                                    cmd: 'KundeLoad',
                                    id_kunde: responseData.data.id_kunde
                                }
                            });
                            Ext.StoreMgr.get('begleitpersonenStore').load({
                                params:{id_kunde:responseData.data.id_kunde}
//                                success:function() {
//                                    Ext.getCmp('cmbBegleitperson1').setValue(Ext.getCmp('id_erste_ansprechperson').getValue());
//                                }
                            });
                            
                        },
                        failure: function() {
                            Ext.example.msg('Error', 'Fehler beim Laden der Ansprechperson.');
                        },
                        method: 'POST',
                        params: {
                            cmd: 'BegleitpersonLoad', 
                            id_begleitperson: Ext.getCmp('id_erste_ansprechperson').getValue()
                        }
                    });

                    Ext.getCmp('buchungAp2').getForm().load({
                        url: 'index.php',
                        success: function(form,action) {
                       
                        },
                        failure: function() {
                            //Ext.example.msg('Error', 'Fehler beim Laden der Ansprechperson.');
                        },
                        method: 'POST',
                        params: {
                            cmd: 'BegleitpersonLoad',
                            id_begleitperson: Ext.getCmp('id_zweite_ansprechperson').getValue()
                        }
                    });
                    
                    Ext.getCmp('cmbBusunternehmen').setValue("");
                    Ext.getCmp('bustourForm').getForm().reset();
                    Ext.getCmp('bustourForm').getForm().load({
                        url:'index.php',
                        method:'POST',
                        params:{
                            cmd:'BusausschreibungLoad',
                            id_ausschreibung:resp.data.id_ausschreibung
                        }
                   });
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden der Buchungsdaten.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Buchung laden',
                method: 'POST',
                params: {cmd: 'BuchungLoad', id_buchung: grid.getStore().getAt(rowIndex).id}
            });
            Ext.StoreMgr.get('hinweiseStore').load({params:{id_buchung:grid.getStore().getAt(rowIndex).id}});
        });
        
    }
}