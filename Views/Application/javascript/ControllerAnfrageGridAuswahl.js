ControllerAnfrageGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Anfragen</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var anfrageForm = Ext.getCmp('anfrageForm');
            anfrageForm.Controller.enableAllChilds();
            anfrageForm.Controller.enableAllToolbarButtons();
            anfrageForm.getForm().reset();
            Ext.getCmp('btn_buchung').disable();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUE ANFRAGE, UNGESPEICHERT</b>");
            Ext.getCmp('anfrage_id').setValue('0');
            Ext.getCmp('cmbAngebotsvorlagen').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Anfrage Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+' der Schule '+controller.tmpComponent.getSelectionModel().getSelected().data.schule+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'AnfrageDel',
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
            Ext.getCmp('formheaddisplay').setValue('');
            var anfrageForm = Ext.getCmp('anfrageForm');
            anfrageForm.Controller.enableAllChilds();
            anfrageForm.Controller.enableAllToolbarButtons();
            anfrageForm.getForm().load({
                url: 'index.php',
                success: function(_this, response) {
                    var jsonResp = Ext.decode(response.response.responseText);
                    var v = Ext.StoreMgr.get('turnuslookup').getAt(Ext.StoreMgr.get('turnuslookup').find('id',jsonResp.data.id_turnus));
                    var myDate = new Date(v.get('datum').split("-")[0],v.get('datum').split("-")[1]-1,v.get('datum').split("-")[2]);
                    Ext.getCmp('cmbTurnus').setRawValue(Ext.util.Format.date(myDate, 'd.m.Y') + " / " + v.get('dauer') + " Tage");
                    
                    v = Ext.StoreMgr.get('turnuslookup').getAt(Ext.StoreMgr.get('turnuslookup').find('id',jsonResp.data.id_ersatzturnus));
                    myDate = new Date(v.get('datum').split("-")[0],v.get('datum').split("-")[1]-1,v.get('datum').split("-")[2]);
                    Ext.getCmp('cmbErsatzTurnus').setRawValue(Ext.util.Format.date(myDate, 'd.m.Y') + " / " + v.get('dauer') + " Tage");
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Anfrage laden',
                method: 'POST',
                params: {cmd: 'AnfrageLoad', id_anfrage: grid.getStore().getAt(rowIndex).id}
            });
        });
        
    }
}