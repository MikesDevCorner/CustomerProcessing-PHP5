Application.ControllerKundenGridAuswahl = function()
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
        Application.pollForChanges(this.tmpComponent,true);
    }


    this.Init = function()
    {
        this.GetComponent().getStore()._pollEnabled=true;
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Kunden</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var kundenPanel = Ext.getCmp('kundenForm');
            var kundenForm = Ext.getCmp('formarea');
            kundenPanel.Controller.enableAllChilds();
            kundenPanel.Controller.enableAllToolbarButtons();
            Ext.getCmp('ansprechpersonenForm').getForm().reset();
            Ext.getCmp('saveAnsprechperson').disable();
            Ext.getCmp('cancelAnsprechperson').disable();
            Ext.getCmp('kundenForm').Controller.disableAllAnsprechChilds();
            Ext.getCmp('ansprechpersonenGrid').getStore().removeAll();            
            kundenForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUER KUNDE, UNGESPEICHERT</b>");
            Ext.getCmp('id_kunde').setValue('0');
            Ext.getCmp('name_schule').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Den Kunden mit der Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', '+controller.tmpComponent.getSelectionModel().getSelected().data.name_schule+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'KundeDel',
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


        this.tmpComponent.getStore().on('beforeload', function(store, options) {
            Ext.each(Ext.getCmp('suchpanel').items.items, function(item) {
               options.params[item.getName()] = item.getValue();
            });
            options.params.usefilter = Application.UseFilter;
        });



        this.tmpComponent.on('rowclick', function(grid,rowIndex){
            var kundenPanel = Ext.getCmp('kundenForm');
            var kundenForm = Ext.getCmp('formarea');
            kundenPanel.Controller.enableAllChilds();
            kundenPanel.Controller.enableAllToolbarButtons();
            Ext.getCmp('ansprechpersonenForm').getForm().reset();
            Ext.getCmp('saveAnsprechperson').disable();
            Ext.getCmp('cancelAnsprechperson').disable();
            Ext.getCmp('kundenForm').Controller.disableAllAnsprechChilds();
            kundenForm.getForm().load({
                url: 'index.php',
                success: function(response,options) {
                    //Ext.example.msg('Status', 'Angebotsvorlagen erfolgreich geladen.');
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Kunde laden',
                method: 'POST',
                params: { cmd: 'KundeLoad', id_kunde: grid.getStore().getAt(rowIndex).id }
            });
            Ext.getCmp('formheaddisplay').setValue("");
            //Laden der Tabelle Ansprechpartner
            Ext.StoreMgr.get('begleitpersonenStore').load({params:{id_kunde:grid.getStore().getAt(rowIndex).id}});
            
        });


    }
}