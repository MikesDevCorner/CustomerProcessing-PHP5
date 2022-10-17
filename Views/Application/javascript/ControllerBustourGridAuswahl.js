ControllerBustourGridAuswahl = function()
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
        Ext.getCmp('gridtitle').setValue("<b>&nbsp;Busausschreibungen</b>");
    }

    this.SetListeners = function()
    {        
        this.tmpComponent.getStore().on('beforeload', function(store, options) { 
            Ext.each(Ext.getCmp('suchpanel').items.items, function(item) {
               options.params[item.getName()] = item.getValue();
            });
            options.params.usefilter = Application.UseFilter;
        });

        Ext.getCmp('btn_add').on('click', function() {
            controller.tmpComponent.getSelectionModel().clearSelections();
            Ext.getCmp('busunternehmenAdd').enable();
            Ext.getCmp('busunternehmenDel').enable();
            Ext.StoreMgr.get('actualBusunternehmenStore').removeAll();
            var ausschreibungsForm = Ext.getCmp('formarea');
            var ausschreibungsContainer = Ext.getCmp('bustourForm');
            ausschreibungsContainer.Controller.enableAllChilds();
            ausschreibungsContainer.Controller.enableAllToolbarButtons();
            ausschreibungsForm.getForm().reset();
            Ext.getCmp('formheaddisplay').setValue("<b style='color:red;'>NEUE BUSAUSSCHREIBUNG, UNGESPEICHERT</b>");
            Ext.getCmp('id_ausschreibung').setValue('0');
            Ext.getCmp('kurztext').focus();
        });


        Ext.getCmp('btn_delete').on('click', function() {
            if(controller.tmpComponent.getSelectionModel().hasSelection())
            {
                Ext.Msg.show({
                   title:'Löschen',
                   msg: 'Die Bustour mit der Nr. '+controller.tmpComponent.getSelectionModel().getSelected().data.id+', Kurztext '+controller.tmpComponent.getSelectionModel().getSelected().data.kurztext+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                   buttons: Ext.Msg.YESNO,
                   fn: function(buttonId) {
                       if(buttonId == 'yes')
                       {
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'BusausschreibungDel',
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
            var formArea = Ext.getCmp('formarea');
            var containerBustour = Ext.getCmp('bustourForm');
            containerBustour.Controller.enableAllChilds();
            containerBustour.Controller.enableAllToolbarButtons();
            Ext.getCmp('busunternehmenAdd').enable();
            Ext.getCmp('busunternehmenDel').enable();
            Ext.getCmp('buchungAdd').enable();
            Ext.getCmp('buchungDel').enable();
            Ext.getCmp('busunternehmenExcel').enable();
            Ext.getCmp('busunternehmenPdf').enable();
            formArea.getForm().load({
                url: 'index.php',
                success: function(form,action) {
                    //var resp = Ext.decode(action.response.responseText);

                },
                failure: function() {
                    Ext.example.msg('Error', 'Fehler beim Laden der Busausschreibung.');
                },
                waitMsg:'Laden...', 
                waitTitle:'Busausschreibung laden',
                method: 'POST',
                params: {cmd: 'BusausschreibungLoad', id_ausschreibung: grid.getStore().getAt(rowIndex).id}
            });
            Ext.StoreMgr.get("buchungenByBustourStore").load({
                params: {
                   id_ausschreibung: grid.getStore().getAt(rowIndex).id
                }
            });
            
            Ext.StoreMgr.get('actualBusunternehmenStore').load({
               params: {
                   id_ausschreibung: grid.getStore().getAt(rowIndex).id
               } 
            });
        });
        
    }
}