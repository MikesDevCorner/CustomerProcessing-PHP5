Application.ControllerQuartiereFormPanel = function()
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
        Ext.getCmp('formarea').setHeight(260);
        
        
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
            title:'Quatiere',
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
                name:'id_quartier',
                id: 'id_quartier',
                //style:'text-align:right;',
                readOnly:true,
                fieldLabel:'Nummer Quartier'
            },{
                name:'quartier_name',
                id: 'quartier_name',
                allowBlank:false,
                fieldLabel:'Quartier'
            },{
                name:'quartier_adresse',
                id: 'qaurtier_adresse',
                allowBlank:false,
                fieldLabel:'Adresse'
            },{
                name:'quartier_plz',
                id: 'qaurtier_plz',
                allowBlank:false,
                fieldLabel:'PLZ'
            },{
                name:'quartier_ort',
                id: 'qaurtier_ort',
                allowBlank:false,
                fieldLabel:'Ort'
            },{
                name:'quartier_telefon',
                id: 'qaurtier_telefon',
                allowBlank:true,
                fieldLabel:'Telefon'
            },{
                name:'quartier_email',
                id: 'qaurtier_email',
                allowBlank:true,
                fieldLabel:'Email'
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
                xtype:'textfield',
                name:'quartier_vorname',
                id: 'qaurtier_vorname',
                allowBlank:true,
                fieldLabel:'Vorname'
            },{
                xtype:'textfield',
                name:'quartier_nachname',
                id: 'qaurtier_nachname',
                allowBlank:true,
                fieldLabel:'Nachname'
            },{
                xtype:'textfield',
                name:'quartier_handy',
                id: 'qaurtier_handy',
                allowBlank:true,
                fieldLabel:'Mobil'
            },{
                xtype:'textarea',
                name:'quartier_bemerkung',
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
        
        
       

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'editorgrid',
            id:'regionenQuartiereGrid',
            clicksToEdit:2,
            tbar:[{
                iconCls:'save',
                id:'saveRegionenToQuartiere',
                disabled:true,
                tooltip:'Regionen speichern',
                handler: function() {
                    var array = '';
                    var doSave = true;
                    Ext.each(Ext.StoreMgr.get('regionenByQuartiere').data.items,function(item) {
                       if(item.data.id_region != "neue Region")
                       {
                           array += item.data.id_region+",";

                           var index = Ext.StoreMgr.get('regionenByQuartiere').findExact('id_region',item.data.id_region,0);
                           var howOften = 0;
                           while(index != -1)
                           {
                                howOften = howOften + 1;
                                index = Ext.StoreMgr.get('regionenByQuartiere').findExact('id_region',item.data.id_region,index+1);
                           }
                           if(howOften > 1) doSave = false;
                       }
                    });

                    if(doSave == true)
                    {
                        Ext.Ajax.request({
                           url:'index.php',
                           params:{
                               cmd:'QuartiereRegionenAssign',
                               array:array,
                               id_quartier: Ext.getCmp('id_quartier').getValue()
                           },
                           success: function() {
                                Ext.StoreMgr.get('regionenByQuartiere').commitChanges();
                                Ext.example.msg('Erfolg','Speichern der Regionen auf das Quartier war erfolgreich.')
                           },
                           failure: function() {
                                Ext.example.msg('Fehler','Ein Fehler beim Speichern der Regionen ist aufgetreten.')
                           }
                        });
                    }
                    else Ext.example.msg("Fehler","Doppelte Einträge sind in dieser Tabelle nicht erlaubt.");
                }
            },{
                iconCls:'add',
                id:'addRegionenToQuartiere',
                disabled:true,
                tooltip:'Region hinzufügen',
                handler: function() {
                    var Region = Ext.StoreMgr.get('regionenByQuartiere').recordType;
                    var r = new Region({
                        id_region:"neue Region"
                    });
                    Ext.getCmp('regionenQuartiereGrid').stopEditing();
                    Ext.StoreMgr.get('regionenByQuartiere').insert(0, r);
                    Ext.getCmp('regionenQuartiereGrid').startEditing(0, 0);
                }
            },{

                iconCls:'delete',
                id:'delRegionFromQuartiere',
                disabled:true,
                tooltip:'Region löschen',
                handler: function() {
                    var recordToDel = Ext.getCmp('regionenQuartiereGrid').getSelectionModel().getSelected();
                    Ext.StoreMgr.get('regionenByQuartiere').remove(recordToDel);
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
                        listConfig:{
                            loadingText:'Suche...',
                            emptyText:'Keine Region gefunden'
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
                storeId:'regionenByQuartiere',
                baseParams: {cmd:'RegionenGetByQuartiere'},
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
                    Ext.example.msg('Erfolg', 'Quartiere gespeichert.');
                    Ext.getCmp('quartiereauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'QuartiereSave'}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_quartier_load = Ext.getCmp('id_quartier').getValue();
            if(id_quartier_load != '0')
            {
                controller.tmpComponent.getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Quartier wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                    waitMsg:'Laden...',
                    waitTitle:'Qurtier laden',
                    params: {cmd: 'QuartiereLoad', id_quartier: id_quartier_load}
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