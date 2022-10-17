Application.ControllerAngebotsvorlagenGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Angebotsvorlagen</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var angebotsvorlagenForm = Ext.getCmp('angebotsvorlagenForm');
            Ext.StoreMgr.get('leistungenByAngebotsvorlage').removeAll();
            Ext.StoreMgr.get('regionenByAngebotsvorlage').removeAll();
            angebotsvorlagenForm.Controller.enableAllChilds();
            angebotsvorlagenForm.Controller.enableAllToolbarButtons();
            Ext.getCmp('saveLeistungenToAngebotsvorlage').disable();
            Ext.getCmp('addLeistungToAngebotsvorlage').disable();
            Ext.getCmp('delLeistungFromAngebotsvorlage').disable();
            Ext.getCmp('saveRegionenToAngebotsvorlage').disable();
            Ext.getCmp('addRegionenToAngebotsvorlage').disable();
            Ext.getCmp('delRegionFromAngebotsvorlage').disable();
            angebotsvorlagenForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUE ANGEBOTSVORLAGE, UNGESPEICHERT</b>");
            Ext.getCmp('id_angebotsvorlage').setValue('0');
            Ext.getCmp('angebotsname').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Angebotsvorlage Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', '+controller.tmpComponent.getSelectionModel().getSelected().data.angebotsname+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'AngebotsvorlagenDel',
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
            var angebotsvorlagenForm = Ext.getCmp('angebotsvorlagenForm');
            Ext.getCmp('saveLeistungenToAngebotsvorlage').enable();
            Ext.getCmp('addLeistungToAngebotsvorlage').enable();
            Ext.getCmp('delLeistungFromAngebotsvorlage').enable();
            Ext.getCmp('saveRegionenToAngebotsvorlage').enable();
            Ext.getCmp('addRegionenToAngebotsvorlage').enable();
            Ext.getCmp('delRegionFromAngebotsvorlage').enable();
            Ext.getCmp('formheaddisplay').setValue("");
            angebotsvorlagenForm.Controller.enableAllChilds();
            angebotsvorlagenForm.Controller.enableAllToolbarButtons();
            angebotsvorlagenForm.getForm().load({
                url: 'index.php',
                success: function(response,options) {
                    //Ext.example.msg('Status', 'Angebotsvorlagen erfolgreich geladen.');
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Angebotsvorlagen laden',
                method: 'POST',
                params: { cmd: 'AngebotsvorlagenLoad', id_angebotsvorlage: grid.getStore().getAt(rowIndex).id }
            });
            
            //Laden der Tabellen Regionen und Leistungen
            Ext.StoreMgr.get('leistungenByAngebotsvorlage').load({params:{angebotsvorlageId:grid.getStore().getAt(rowIndex).id}});
            Ext.StoreMgr.get('regionenByAngebotsvorlage').load({params:{angebotsvorlageId:grid.getStore().getAt(rowIndex).id}});
            
        });


    }
}