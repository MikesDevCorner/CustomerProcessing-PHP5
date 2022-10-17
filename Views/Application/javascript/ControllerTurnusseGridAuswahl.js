Application.ControllerTurnusseGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Turnusse</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var turnusForm = Ext.getCmp('turnusForm');
            turnusForm.Controller.enableAllChilds();
            turnusForm.Controller.enableAllToolbarButtons();
            turnusForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUER TURNUS, UNGESPEICHERT</b>");
            Ext.getCmp('id_turnus').setValue('0');
            Ext.getCmp('turnus_start').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Turnus Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', '+controller.tmpComponent.getSelectionModel().getSelected().data.turnus_start+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'TurnusseDel',
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
            Ext.getCmp('formheaddisplay').setValue("");
            var turnusForm = Ext.getCmp('turnusForm');
            turnusForm.Controller.enableAllChilds();
            turnusForm.Controller.enableAllToolbarButtons();
            turnusForm.getForm().load({
                url: 'index.php',
                success: function(response,options) {
                    //Ext.example.msg('Status', 'Turnusse erfolgreich geladen.');
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Turnus laden',
                method: 'POST',
                params: { cmd: 'TurnusseLoad', id_turnus: grid.getStore().getAt(rowIndex).id }
            });
        });


    }
}