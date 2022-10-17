ControllerBustourContainerPanel = function()
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

    this.enableAllChilds = function()
    {
        var formArea = Ext.getCmp('formarea');
        //Alle Items des Formualres enablen (da disabled initiiert wurde).
        Ext.each(formArea.findByType('textfield'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('displayfield'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('numberfield'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('combo'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('xdatefield'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('textarea'),function(item){
            item.enable();
        });
        Ext.each(formArea.findByType('checkbox'),function(item){
            item.enable();
        });
    }

    this.disableAllChilds = function()
    {
        var formArea = Ext.getCmp('formarea');
        //Alle Items des Formualres disablen
        Ext.each(formArea.findByType('textfield'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('displayfield'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('numberfield'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('combo'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('xdatefield'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('textarea'),function(item){
            item.disable();
        });
        Ext.each(formArea.findByType('checkbox'),function(item){
            item.disable();
        });
    }


    this.Init = function()
    {
        //Setzen der Höhe des oberen Formularbereiches (mit Leftfield und Rightfield als Inhalt)
        var formarea = Ext.getCmp('formarea');
        formarea.setHeight(280);    
        
        
        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            title:'Busausschreibungsdaten',
            labelWidth:140,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'96%', 
                disabled:true,
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}"
            },
            items:[{
                name:'id_ausschreibung',
                id: 'id_ausschreibung',
                readOnly:true,
                fieldLabel:'Ausschreibungsnummer'
            },{
                fieldLabel:'Kurzbeschreibung*',
                allowBlank:false,
                id:'kurztext',
                name:'kurztext',
                xtype:'textfield'
            },{
                fieldLabel:'Datum*',
                allowBlank:false,
                name:'datum',
                format:'d.m.Y',
                xtype:'xdatefield'
            },{
                fieldLabel:'KM*',
                xtype:'numberfield',
                allowBlank:false,
                name:'km'
            },{
                fieldLabel:'Dauer*',
                allowBlank:false,
                name:'dauer'
            },{
                fieldLabel:'Anzahl Personen*',
                xtype:'numberfield',
                allowBlank:false,
                name:'anzahl_personen'
            },{
                fieldLabel:'Name Fahrer',
                //readOnly:true,
                name:'name_fahrer'
            },{
                fieldLabel:'Handy Fahrer',
                //readOnly:true,
                name:'handy_fahrer'
            }]
        });
        
        this.tmpComponent.findById('rightfield').add({
            xtype:'fieldset',
            title:'Info',
            labelWidth:140,
            defaults:{
                msgTarget: 'side',
                anchor:'96%',
                disabled:true
                //minValue:0,
                //minText:'Bitte geben Sie einen Wert größer als {0} an.',
                //maxValue:32767,
                //maxText:'Der größtmögliche Wert für dieses Feld ist {0}',
                //maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                //blankText:'Dieses Feld ist ein Pflichtfeld.',
                //decimalPrecision:0
            },
            items:[{
                fieldLabel:'Tourenbeschreibung',
                name:'bemerkung',
                height:151,
                xtype:'textarea'
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

        //Store für die Combo
        var busunternehmenStore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'busunternehmen'}],
            url:'index.php',
            storeId:'busunternehmenStore',
            totalProperty:'total',
            baseParams: {cmd:'BusunternehmenGetList', usefilter:false},
            root:'results'
        });
        busunternehmenStore.load({params:{start:0, limit: Application.PageSize}});

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'editorgrid',
            title:'Buchungen auf dieser Bustour',
            id:'buchungenTourGrid',
            bodyStyle:'background:#E3ECFA;',
            border:false,
            store:new Ext.data.JsonStore({
                url:'index.php',
                totalProperty:'total',
                root:'results',
                fields:['id','datum','schule','anzahl_pers'],
                storeId:'buchungenByBustourStore',
                baseParams:{cmd:'BuchungenLoadByBustour'}
            }),
            viewConfig: {
                forceFit:true,
                columnsText:'Spalten',
                sortAscText:'aufsteigend sortieren',
                sortDescText:'absteigend sortieren',
                emptyText:'Keine Datensätze verfügbar',
                headersDisabled:true,
                scrollOffset:0
            },
            sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
            columns:[
                {header:'Buchungsnummer',dataIndex:'id'},
                {header:'Datum',dataIndex:'datum'},
                {header:'Schule',dataIndex:'schule'},
                {header:'Personen',dataIndex:'anzahl_pers'}
            ],
            tbar:[{
                iconCls:'add',
                disabled:true,
                id:'buchungAdd',
                tooltip:'Buchung hinzufügen',
                handler: function() {
                    var inputField = Ext.getCmp('buchungsIdInput');
                    if(inputField.hidden) {
                        inputField.setValue('');
                        inputField.show();
                        Ext.getCmp('buchungDel').hide();
                    }
                    else {
                        if(Ext.StoreMgr.get("buchungenByBustourStore").find("id",inputField.getValue()) != -1)
                        {
                            Ext.example.msg("Fehler","Diese Buchungsnummer existiert bereits auf dieser Ausschreibung");
                        }
                        else
                        {                        
                            if(inputField.getValue() != "")
                            {
                                Ext.Ajax.request({
                                    params: {cmd:'BuchungenLoadByBustour', id_buchung:inputField.getValue()},
                                    url:'index.php',
                                    success: function(response,options) {
                                        var respJson = Ext.decode(response.responseText);
                                        if(respJson.results.length != 1)
                                        { //fail
                                            Ext.example.msg("Fehler","Konnte Buchungsnummer nicht auflösen. Buchung nicht erkannt.");
                                        }
                                        else { //add response as buchungs-object to grid...   
                                            var myBuchung = Ext.StoreMgr.get('buchungenByBustourStore').recordType;
                                            var b = new myBuchung({
                                                id: respJson.results[0].id,
                                                datum: respJson.results[0].datum,
                                                schule: respJson.results[0].schule,
                                                anzahl_pers: respJson.results[0].anzahl_pers
                                            });
                                            Ext.StoreMgr.get('buchungenByBustourStore').insert(0, b);
                                        }
                                        inputField.hide();
                                        Ext.getCmp('buchungDel').show();
                                    },
                                    failure: function(response,options) {
                                        Ext.example.msg("Fehler","Fehler beim Auflösen der Buchungsnummer...");
                                        inputField.hide();
                                        Ext.getCmp('buchungDel').show();
                                    }
                                });
                            }
                            else
                            {
                                inputField.hide();
                                Ext.getCmp('buchungDel').show();
                            }
                        }
                    }                    
                }
            },{
                iconCls:'delete',
                disabled:true,
                id:'buchungDel',
                tooltip:'Buchung löschen',
                handler: function() {
                    var recordToDel = Ext.getCmp('buchungenTourGrid').getSelectionModel().getSelected();
                    Ext.StoreMgr.get('buchungenByBustourStore').remove(recordToDel);
                }
            },{
                xtype:'numberfield',
                id:'buchungsIdInput',
                emptyText:'Buchungsnummer eingeben',
                minValue:1,
                maxValue:16000,
                hidden:true
            }]
        },{
            xtype:'editorgrid',
            id:'busunternehmenGrid',
            title:'Ausschreibung an diese Busunternehmen',
            bodyStyle:'background:#E3ECFA;',
            tbar:[{
                iconCls:'add',
                disabled:true,
                id:'busunternehmenAdd',
                tooltip:'Busunternehmen hinzufügen',
                handler: function() {
                    var Busunternehmen = Ext.StoreMgr.get('actualBusunternehmenStore').recordType;
                    var b = new Busunternehmen({
                        icon:"<img src='Resources/images/bus.png' alt='pic' />",
                        id:0,
                        preisvorschlag:0,
                        gewonnen:false
                    });
                    Ext.getCmp('busunternehmenGrid').stopEditing();
                    Ext.StoreMgr.get('actualBusunternehmenStore').insert(0, b);
                    Ext.getCmp('busunternehmenGrid').startEditing(0, 0);

                }
            },{
                iconCls:'delete',
                disabled:true,
                id:'busunternehmenDel',
                tooltip:'Busunternehmen löschen',
                handler: function() {
                    var recordToDel = Ext.getCmp('busunternehmenGrid').getSelectionModel().getSelected();
                    Ext.StoreMgr.get('actualBusunternehmenStore').remove(recordToDel);
                }
            }],
            border:false,
            clicksToEdit:2,
            flex:1,
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
            store:new Ext.data.JsonStore({
                url:'index.php',
                storeId: 'actualBusunternehmenStore',
                baseParams: {cmd:'BusunternehmenGetByBusausschreibung'},
                root:'results',
                fields: ['icon','id','preisvorschlag','gewonnen']
            }),
            sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
            columns:[
                {header:'',dataIndex:'icon',width:40},
                {
                    header:'Busunternehmen',
                    dataIndex:'id',
                    width:230,
                    editor: {
                        xtype:'combo',
                        editable: false,
                        listeners: {
                            beforeselect:{
                                scope:this,
                                fn: function(cmb,rec,index) {
                                    if(Ext.StoreMgr.get("actualBusunternehmenStore").find("id",rec.data.id) != -1) {
                                        Ext.example.msg("Fehler","Dieser Busunternehmer existiert bereits auf dieser Ausschreibung");
                                        return false;
                                    }
                                }
                            }
                        },
                        allowBlank:false,
                        pageSize: Application.PageSize,
                        triggerAction: 'all',
                        mode:'local',
                        store: busunternehmenStore,
                        valueField: 'id',
                        displayField: 'busunternehmen'
                    },
                    renderer:function(value,meta,rec,row,col,store) {
                        var dataset = busunternehmenStore.getAt(busunternehmenStore.find('id',value));
                        if(dataset != undefined) return dataset.data.busunternehmen;
                        else return '';
                    }
                },{
                    header:'bester Preisvorschlag',
                    dataIndex:'preisvorschlag',
                    width:100,
                    editor:{xtype:'textfield'}
                },{
                    header:'Gewinner',
                    dataIndex:'gewonnen',
                    align:'center',
                    editor: {
                        xtype:'checkbox',
                        listeners: {
                            change: {
                                scope:this,
                                fn: function(cb, newValue, oldValue) {
                                    Ext.StoreMgr.get("actualBusunternehmenStore").each(function(item) {
                                        if(item.data.id != Ext.getCmp('busunternehmenGrid').getSelectionModel().getSelected().data.id)
                                            item.data.gewonnen = 0;
                                        else
                                            item.data.gewonnen = 1;
                                    });
                                    Ext.StoreMgr.get("actualBusunternehmenStore").fireEvent('datachanged');
                                }
                            }
                        }
                    },
                    renderer: function(value) {
                        if(value == true) return "ja";
                        else return "nein";
                    }
                }
            ]      
        });
        tabarea.setActiveTab(0);

        
        Ext.getCmp('busunternehmenGrid').getTopToolbar().add({
           disabled:true,
           id:'busunternehmenExcel',
           iconCls:'excel',
           tooltip:'Ausschreibungsdetails für Busunternehmen als Excel downloaden',
           handler: function() {
               if(Ext.getCmp('busunternehmenGrid').getSelectionModel().hasSelection())
               {
                   var id_ausschr = Ext.getCmp('id_ausschreibung').getValue();
                   var id_busunt = Ext.getCmp('busunternehmenGrid').getSelectionModel().getSelected().data.id;
                   if(id_ausschr != 0 && id_busunt != 0)
                       window.open("index.php?cmd=BusausschreibungGetFile&type=excel&PHPSESSID=" + Application.sessionId + "&id_ausschreibung="+id_ausschr+"&id_busunternehmen="+id_busunt,'_blank');
                   else
                       Ext.example.msg('Hinweis', 'Es darf keine ungespeicherte Ausschreibung, und kein ungespeichertes Unternehmen gewählt werden. Bitte speichern Sie, bevor Sie fortsetzen.');
               }
               else Ext.example.msg('Hinweis', 'Es muss ein Busunternehmen ausgewählt werden.');
           }
        },{
           disabled:true,
           id:'busunternehmenPdf',
           iconCls:'pdf',
           tooltip:'Ausschreibungsdetails für Busunternehmen als Excel downloaden',
           handler: function() {
               if(Ext.getCmp('busunternehmenGrid').getSelectionModel().hasSelection())
               {
                   var id_ausschr = Ext.getCmp('id_ausschreibung').getValue();
                   var id_busunt = Ext.getCmp('busunternehmenGrid').getSelectionModel().getSelected().data.id;
                   if(id_ausschr != 0 && id_busunt != 0)
                       window.open("index.php?cmd=BusausschreibungGetFile&type=pdf&PHPSESSID=" + Application.sessionId + "&id_ausschreibung="+Ext.getCmp('id_ausschreibung').getValue()+"&id_busunternehmen="+Ext.getCmp('busunternehmenGrid').getSelectionModel().getSelected().data.id,'_blank');
                   else
                       Ext.example.msg('Hinweis', 'Es darf keine ungespeicherte Ausschreibung, und kein ungespeichertes Unternehmen gewählt werden. Bitte speichern Sie, bevor Sie fortsetzen.');
               }
               else Ext.example.msg('Hinweis', 'Es muss ein Busunternehmen ausgewählt werden.');
           }
        });  



        //Toolbar-Buttons für das Formular anpassen
        Ext.getCmp('containerToolbar').add('->',{
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
            var count;            
            
            var storeValues = "";
            var actualBusunternehmenStore = Ext.StoreMgr.get('actualBusunternehmenStore');
            count = 0;
            actualBusunternehmenStore.each(function(item) {
                if(item.data.id != 0)
                {
                    var gewonnen = (item.data.gewonnen != undefined && item.data.gewonnen == true) ? 1 : 0;
                    if(count != 0) storeValues = storeValues + "@@";
                    storeValues = storeValues + item.data.id+"|"+item.data.preisvorschlag+"|"+gewonnen;
                    count = count + 1;
                }
            });
            
            Ext.getCmp('formheaddisplay').setValue('');
            count = 0;
            var buchungenArray = "";
            var buchungenStore = Ext.StoreMgr.get("buchungenByBustourStore");
            buchungenStore.each(function(item) {
                if(count != 0) buchungenArray += ",";
                buchungenArray += item.get("id");
                count++;
            });
            Ext.Ajax.request({
               url:'index.php',
               params:{cmd:'BuchungSaveBustouren',array_buchungen:buchungenArray, id_bustour:Ext.getCmp('id_ausschreibung').getValue()},
               callback: function() {
                   Ext.getCmp('formarea').getForm().submit({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Erfolg', 'Busausschreibung gespeichert.');
                        Ext.getCmp('bustourauswahl').getStore().reload();
                    },
                    failure: function(a,b,c) {
                        Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                    },
                    method: 'POST',
                    params: {
                        cmd: 'BusausschreibungSave',
                        busunternehmen:storeValues
                    }
                });
               }
            });

        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_ausschreibung = Ext.getCmp('id_ausschreibung').getValue();
            if(id_ausschreibung != '0')
            {
                Ext.getCmp('formarea').getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Busausschreibung wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                    waitMsg:'Laden...',
                    waitTitle:'Busausschreibung laden',
                    params: {cmd: 'BusausschreibungLoad', id_ausschreibung: id_ausschreibung}
                });
            }
            else
            {
                Ext.getCmp('formarea').getForm().reset();
                controller.disableAllChilds();
                controller.disableAllToolbarButtons();
                Ext.getCmp('busunternehmenAdd').disable();
                Ext.getCmp('busunternehmenDel').disable();
                Ext.getCmp('busunternehmenExcel').disable();
                Ext.getCmp('busunternehmenPdf').disable();
            }
        });


        Ext.getCmp('formarea').on('clientvalidation',function(form, valid) {
           if(Application.SaveButtonState == true) { savebtn.setDisabled(!valid); }
           else { savebtn.disable(); }
        });


        Ext.getCmp('btn_drucken').on('click', function() {
            //Ext.example.msg('Status', 'Anfrage ausdrucken');
            //Ext.ux.Printer.print(controller.GetComponent().findParentByType('formpanelmodel'));
            window.print();
        });

        /*Ext.getCmp('btn_pdf').on('click', function() {
            Ext.example.msg('Status', 'PDF-Datei aus Anfrage generieren');
        });*/
        
    }
}