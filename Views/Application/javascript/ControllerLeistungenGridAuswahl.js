Application.ControllerLeistungenGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Leistungen</b>");
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            var leistungenForm = Ext.getCmp('leistungenForm');
            leistungenForm.Controller.enableAllChilds();
            leistungenForm.Controller.enableAllToolbarButtons();
            leistungenForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUE LEISTUNG, UNGESPEICHERT</b>");
            Ext.getCmp('id_leistungen').setValue('0');
            Ext.getCmp('leistungsname').focus();
        });

        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Leistung Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', '+controller.tmpComponent.getSelectionModel().getSelected().data.leistung+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'LeistungenDel',
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
            var leistungenForm = Ext.getCmp('leistungenForm');
            leistungenForm.Controller.enableAllChilds();
            leistungenForm.Controller.enableAllToolbarButtons();
            leistungenForm.getForm().load({
                url: 'index.php',
                success: function(form, action) {
                    var partner = Ext.decode(action.response.responseText).data.partner;
                    Ext.StoreMgr.get('partnerleistungenstore').load({
                        params:{start:0, limit: Application.PageSize,query:partner},
                        callback: function() {
                            var combo = Ext.getCmp('cmbPartnerLeistungen');
                            combo.setValue(combo.getRawValue());
                        }
                    });
                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Leistungen laden',
                method: 'POST',
                params: { cmd: 'LeistungenLoad', id_leistungen: grid.getStore().getAt(rowIndex).id }
            });
        });


    }
}