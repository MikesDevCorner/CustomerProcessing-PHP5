Application.ControllerAngebotsvorlagenFormPanel = function()
{
    var controller = this;

    this.tmpComponent = null;

    this.AssignComponent = function(component)
    {
        this.tmpComponent = component;
    }

    this.GetComponent = function()
    {
        return this.tmpComponent;
    }

    this.enableAllChilds = function()
    {
        //Alle Items des Formualres enablen (da disabled initiiert wurde).
        Ext.each(this.tmpComponent.findByType('textfield'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('displayfield'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('numberfield'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('combo'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('xdatefield'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('textarea'),function(item){
            item.enable();
        });
        Ext.each(this.tmpComponent.findByType('checkbox'),function(item){
            item.enable();
        });
    }

    this.disableAllChilds = function()
    {
        //Alle Items des Formualres disablen
        Ext.each(this.tmpComponent.findByType('textfield'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('displayfield'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('numberfield'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('combo'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('xdatefield'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('textarea'),function(item){
            item.disable();
        });
        Ext.each(this.tmpComponent.findByType('checkbox'),function(item){
            item.disable();
        });
    }

    this.registerInForm = function()
    {
        //Items in der Ext.form.BasicForm registrieren:
        Ext.each(this.tmpComponent.findByType('textfield'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('numberfield'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('combo'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('xdatefield'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('textarea'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('checkbox'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
        Ext.each(this.tmpComponent.findByType('hidden'),function(item){
            controller.tmpComponent.getForm().add(item);
        });
    }

    this.enableAllToolbarButtons = function()
    {
        Ext.each(this.tmpComponent.getTopToolbar().items.items, function(item){
           item.enable();
        });
        Application.SaveButtonState = true;
    }

    this.disableAllToolbarButtons = function() {
        Ext.each(this.tmpComponent.getTopToolbar().items.items, function(item){
           item.disable();
        });
        Application.SaveButtonState = false;
    }


    this.Init = function()
    {
        //Setzen der Höhe des oberen Formularbereiches (mit Leftfield und Rightfield als Inhalt)
        Ext.getCmp('formarea').setHeight(190);
        
        var leistungenLookup = new Ext.data.JsonStore({
            autoLoad:true,
            fields: [{name:'id'},{name:'leistung'}],
            url:'index.php',
            id:'leistungenLookup',
            baseParams: {cmd:'LeistungenGetList',mode:'lookup'},
            root:'results'
        });
        
        var regionenLookup = new Ext.data.JsonStore({
            autoLoad:true,
            fields: [{name:'id'},{name:'region'}],
            url:'index.php',
            id:'regionenLookup',
            baseParams: {cmd:'RegionGetList',mode:'lookup'},
            root:'results'
        });

        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            title:'Angebotsvorlage',
            labelWidth:150,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'90%',
                disabled:true,
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}"
            },
            items:[{
                name:'id_angebotsvorlage',
                id: 'id_angebotsvorlage',
                //style:'text-align:right;',
                readOnly:true,
                fieldLabel:'Nummer Angebotsvorlage'
            },{
                name:'angebotsname',
                id: 'angebotsname',
                allowBlank:false,
                fieldLabel:'Angebotsvorlage'
            }]
        }); 
        
        this.tmpComponent.findById('rightfield').add({
            xtype:'fieldset',
            title:'Weitere Infos',
            labelWidth:140,
            defaults:{
                msgTarget: 'side',
                anchor:'90%', 
                disabled:true,
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}"
            },
            items:[{
                xtype:'textarea',
                name:'bemerkung',
                fieldLabel:'Bemerkung'
            },{
                xtype:'textfield',
                name:'letzter_bearbeiter',
                readOnly:true,
                fieldLabel:'letzter Bearbeiter'
            },{
                name:'letzte_bearbeitung',
                xtype:'xdatefield',
                format:'d.m.Y',
                hideTrigger:true,
                readOnly:true,
                fieldLabel:'letzte Bearbeitung'
            }]
        });
        
        
        //Store für die Grid (Regionen)
        var regionenStore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'region'}],
            url:'index.php',
            id:'regionstore_x',
            totalProperty:'total',
            baseParams: {cmd:'RegionGetList'},
            root:'results'
        });
        regionenStore.load({params:{start:0, limit: Application.PageSize}});
        
        
        //Store für die Grid (Leistungen) - LOOKUP
        var leistungenStore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'leistung'}],
            url:'index.php',
            id:'leistungstore_x',
            totalProperty:'total',
            baseParams: {cmd:'LeistungenGetList'},
            root:'results'
        });
        leistungenStore.load({params:{start:0, limit: Application.PageSize}});
        

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'editorgrid',
            id:'LeistungenAngebotsvorlagenGrid',
            clicksToEdit:2,
            title:'Leistungen',
            tbar:[{
                iconCls:'save',
                id:'saveLeistungenToAngebotsvorlage',
                disabled:true,
                tooltip:'Leistungen speichern',
                handler: function() {
                    var array = '';
                    var doSave = true;
                    Ext.each(Ext.StoreMgr.get('leistungenByAngebotsvorlage').data.items,function(item) {
                       if(item.data.id_leistungen != "neue Leistung")
                       {
                           if(item.data.id_leistungen == '' || item.data.id_leistungen == 0 || item.data.id_leistungen == undefined) doSave = false;
                           array += item.data.id_leistungen + "|" + (item.data.leistungstag!=""?item.data.leistungstag:1) + "|" + item.data.uhrzeit + ",";

//                           var index = Ext.StoreMgr.get('leistungenByAngebotsvorlage').findExact('id_leistungen',item.data.id_leistungen,0);
//                           var howOften = 0;
//                           while(index != -1)
//                           {
//                                howOften = howOften + 1;
//                                index = Ext.StoreMgr.get('leistungenByAngebotsvorlage').findExact('id_leistungen',item.data.id_leistungen,index+1);
//                           }
//                           if(howOften > 1) doSave = false;
                       }
                    });
                    if(doSave == true)
                    {
                        Ext.Ajax.request({
                           url:'index.php',
                           params:{
                               cmd:'AngebotsvorlagenLeistungenAssign',
                               array:array,
                               id_angebotsvorlage: Ext.getCmp('id_angebotsvorlage').getValue()
                           },
                           success: function() {
                                //Ext.StoreMgr.get('leistungenByAngebotsvorlage').commitChanges();
                                Ext.example.msg('Erfolg','Speichern der Leistungen auf die Angebotsvorlage erfolgreich.')
                                Ext.StoreMgr.get('leistungenByAngebotsvorlage').load({params:{angebotsvorlageId:Ext.getCmp('id_angebotsvorlage').getValue()}});
                           },
                           failure: function() {
                                Ext.example.msg('Erfolg','Ein Fehler beim Speichern der Leistungen ist aufgetreten.')
                           }
                        });
                    }
                    else
                    {
                        Ext.example.msg("Fehler","Doppelte Einträge sind in dieser Tabelle nicht erlaubt.")
                    }
                }
            },{
                iconCls:'add',
                disabled:true,
                id:'addLeistungToAngebotsvorlage',
                tooltip:'Leistungen hinzufügen',
                handler: function() {
                    var Leistungen = Ext.StoreMgr.get('leistungenByAngebotsvorlage').recordType;
                    var l = new Leistungen({
                        leistungstag:1,
                        id_leistungen:"",
                        uhrzeit:""
                    });
                    Ext.getCmp('LeistungenAngebotsvorlagenGrid').stopEditing();
                    Ext.StoreMgr.get('leistungenByAngebotsvorlage').insert(0, l);
                    Ext.getCmp('LeistungenAngebotsvorlagenGrid').startEditing(0, 0);
                }
            },{

                iconCls:'delete',
                disabled:true,
                id:'delLeistungFromAngebotsvorlage',
                tooltip:'Leistungen löschen',
                handler: function() {
                    var recordToDel = Ext.getCmp('LeistungenAngebotsvorlagenGrid').getSelectionModel().getSelected();
                    Ext.StoreMgr.get('leistungenByAngebotsvorlage').remove(recordToDel);
                }
            }],
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            columns: [{
                renderer: function() {return "<img src='Resources/images/16x16/product16.png' alt='pic' />";},
                width:8
            },{
                header:'Leistung',
                dataIndex:'id_leistungen',
                width:100,
                renderer: function(value,meta,rec,row,col,store) {
                    var dataset = leistungenLookup.getAt(leistungenLookup.findExact('id',value));
                    if(dataset != undefined) return dataset.data.leistung;
                    else return '';
                },
                editor: {
                    xtype:'combo',
                    //editable: false,
                    //allowBlank:false,
                    typeAhead: false,
                    hideTrigger:true,
                    forceSelection:true,
                    listConfig: {
                        loadingText: 'Suche...',
                        emptyText: 'Keine Leistung gefunden'
                    },
                    pageSize: Application.PageSize,
                    minChars:2,
                    id:'cmbLeistungenInGrid',
                    store: leistungenStore,
                    valueField: 'id',
                    displayField: 'leistung'
                }
            },{
                header:'Tag',
                width:50,
                dataIndex:'leistungstag',
                editor:{xtype:'numberfield'}
            },{
                header:'Uhrzeit (hh:mm)',
                width:80,
                dataIndex:'uhrzeit',
                editor:{xtype:'timefield',format:'H:i',altFormats:'',increment:5}
            }],
            stripeRows:true,
            viewConfig: {
                forceFit:true,
                columnsText:'Spalten',
                sortAscText:'aufsteigend sortieren',
                sortDescText:'absteigend sortieren',
                emptyText:'Keine Datensätze verfügbar',
                headersDisabled:true,
                scrollOffset:0
            },
            store: new Ext.data.JsonStore({
                url:'index.php',
                totalProperty:'total',
                storeId:'leistungenByAngebotsvorlage',
                baseParams: {cmd:'LeistungenGetByAngebotsvorlage'},
                root:'results',
                fields: [
                    {name:'id_leistungen'},
                    {name:'leistungstag'},
                    {name:'uhrzeit'}
                ]
            })
        },{
            xtype:'editorgrid',
            id:'regionenAngebotsvorlagenGrid',
            clicksToEdit:2,
            tbar:[{
                iconCls:'save',
                id:'saveRegionenToAngebotsvorlage',
                disabled:true,
                tooltip:'Regionen speichern',
                handler: function() {
                    var array = '';
                    var doSave = true;
                    Ext.each(Ext.StoreMgr.get('regionenByAngebotsvorlage').data.items,function(item) {
                       if(item.data.id_region != "neue Region")
                       {
                           array += item.data.id_region+",";

                           var index = Ext.StoreMgr.get('regionenByAngebotsvorlage').findExact('id_region',item.data.id_region,0);
                           var howOften = 0;
                           while(index != -1)
                           {
                                howOften = howOften + 1;
                                index = Ext.StoreMgr.get('regionenByAngebotsvorlage').findExact('id_region',item.data.id_region,index+1);
                           }
                           if(howOften > 1) doSave = false;
                       }
                    });

                    if(doSave == true)
                    {
                        Ext.Ajax.request({
                           url:'index.php',
                           params:{
                               cmd:'AngebotsvorlagenRegionenAssign',
                               array:array,
                               id_angebotsvorlage: Ext.getCmp('id_angebotsvorlage').getValue()
                           },
                           success: function() {
                                Ext.StoreMgr.get('regionenByAngebotsvorlage').commitChanges();
                                Ext.example.msg('Erfolg','Speichern der Regionen auf die Angebotsvorlage erfolgreich.')
                           },
                           failure: function() {
                                Ext.example.msg('Erfolg','Ein Fehler beim Speichern der Regionen ist aufgetreten.')
                           }
                        });
                    }
                    else Ext.example.msg("Fehler","Doppelte Einträge sind in dieser Tabelle nicht erlaubt.");
                }
            },{
                iconCls:'add',
                id:'addRegionenToAngebotsvorlage',
                disabled:true,
                tooltip:'Region hinzufügen',
                handler: function() {
                    var Region = Ext.StoreMgr.get('regionenByAngebotsvorlage').recordType;
                    var r = new Region({
                        id_region:"neue Region"
                    });
                    Ext.getCmp('regionenAngebotsvorlagenGrid').stopEditing();
                    Ext.StoreMgr.get('regionenByAngebotsvorlage').insert(0, r);
                    Ext.getCmp('regionenAngebotsvorlagenGrid').startEditing(0, 0);
                }
            },{

                iconCls:'delete',
                id:'delRegionFromAngebotsvorlage',
                disabled:true,
                tooltip:'Region löschen',
                handler: function() {
                    var recordToDel = Ext.getCmp('regionenAngebotsvorlagenGrid').getSelectionModel().getSelected();
                    Ext.StoreMgr.get('regionenByAngebotsvorlage').remove(recordToDel);
                }
            }],
            title:'Regionen',
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            columns: [{
                    renderer: function() {return "<img src='Resources/images/16x16/globe_16.png' alt='pic' />";},
                    width:8
                },{
                    header:'Region Name',
                    dataIndex:'id_region',
                    renderer: function(value,meta,rec,row,col,store) {
                        var dataset = regionenLookup.getAt(regionenLookup.find('id',value));
                        if(dataset != undefined) return dataset.data.region;
                        else return '';
                    },
                    editor: {
                        xtype:'combo',
                        //editable: false,
                        //allowBlank:false,
                        typeAhead:false,
                        hideTrigger:true,
                        forceSelection:true,
                        listconfig:{
                            loadingText:'Suche...'
                        },
                        pageSize: Application.PageSize,
                        minChars:2,
                        //triggerAction: 'all',
                        id:'cmbRegionenInGrid',
                        //mode:'local',
                        store: regionenStore,
                        valueField: 'id',
                        displayField: 'region'
                    }
                }
            ],
            stripeRows:true,
            viewConfig: {
                forceFit:true,
                columnsText:'Spalten',
                sortAscText:'aufsteigend sortieren',
                sortDescText:'absteigend sortieren',
                emptyText:'Keine Datensätze verfügbar',
                headersDisabled:true,
                scrollOffset:0
            },
            store: new Ext.data.JsonStore({
                url:'index.php',
                totalProperty:'total',
                storeId:'regionenByAngebotsvorlage',
                baseParams: {cmd:'RegionenGetByAngebotsvorlage'},
                root:'results',
                fields: [
                    {name:'id_region'}
                ]
            })
        });

        tabarea.setActiveTab(0);
        this.registerInForm();
        
        //Toolbar-Buttons für das Formular anpassen
        Ext.getCmp('formToolbar').add('->',{
            xtype:'displayfield',
            id:'formheaddisplay',
            value:''
        });

    }


    this.SetListeners = function()
    {

        //Listeners für Toolbar Buttons:
        var savebtn = Ext.getCmp('btn_speichern');
        savebtn.on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            controller.tmpComponent.getForm().submit({
                url: 'index.php',
                success: function(response,options) {
                    Ext.example.msg('Erfolg', 'Angebotsvorlage gespeichert.');
                    Ext.getCmp('angebotsvorlagenauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'AngebotsvorlagenSave'}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_angebotsvorlage_load = Ext.getCmp('id_angebotsvorlage').getValue();
            if(id_angebotsvorlage_load != '0')
            {
                controller.tmpComponent.getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Angebotsvorlagen wurden zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                    waitMsg:'Laden...',
                    waitTitle:'Angebotsvorlagen laden',
                    params: {cmd: 'AngebotsvorlagenLoad', id_angebotsvorlage: id_angebotsvorlage_load}
                });
            }
            else
            {
                controller.tmpComponent.getForm().reset();
                controller.disableAllChilds();
                controller.disableAllToolbarButtons();
            }
        });
       

        this.tmpComponent.on('clientvalidation',function(form, valid) {
           if(Application.SaveButtonState == true) {savebtn.setDisabled(!valid);}
           else {savebtn.disable();}
        });


        Ext.getCmp('btn_drucken').on('click', function() {
            //Ext.example.msg('Status', 'Busunternehmen ausdrucken');
            //Ext.ux.Printer.print(controller.GetComponent().findParentByType('formpanelmodel'));
            window.print();
        });        
        
    }
}