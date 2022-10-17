Application.ControllerQuartiereGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Quartiere</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var quartiereForm = Ext.getCmp('quartiereForm');
            Ext.StoreMgr.get('regionenByQuartiere').removeAll();
            quartiereForm.Controller.enableAllChilds();
            quartiereForm.Controller.enableAllToolbarButtons();
            Ext.getCmp('saveRegionenToQuartiere').disable();
            Ext.getCmp('addRegionenToQuartiere').disable();
            Ext.getCmp('delRegionFromQuartiere').disable();
            quartiereForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUES QUARTIER, UNGESPEICHERT</b>");
            Ext.getCmp('id_quartier').setValue('0');
            Ext.getCmp('quartier_name').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Das Quartier Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', '+controller.tmpComponent.getSelectionModel().getSelected().data.quartier_name+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'QuartiereDel',
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
            var quartiereForm = Ext.getCmp('quartiereForm');
            Ext.getCmp('saveRegionenToQuartiere').enable();
            Ext.getCmp('addRegionenToQuartiere').enable();
            Ext.getCmp('delRegionFromQuartiere').enable();
            Ext.getCmp('formheaddisplay').setValue("");
            quartiereForm.Controller.enableAllChilds();
            quartiereForm.Controller.enableAllToolbarButtons();
            quartiereForm.getForm().load({
                url: 'index.php',
                success: function(response,options) {
                    //Ext.example.msg('Status', 'Quartiere erfolgreich geladen.');
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Quartiere laden',
                method: 'POST',
                params: { cmd: 'QuartiereLoad', id_quartier: grid.getStore().getAt(rowIndex).id }
            });
            
            //Laden der Tabelle Regionen
            Ext.StoreMgr.get('regionenByQuartiere').load({params:{quartierId:grid.getStore().getAt(rowIndex).id}});
            
        });


    }
}