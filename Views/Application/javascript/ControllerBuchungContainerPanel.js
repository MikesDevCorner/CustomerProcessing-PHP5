ControllerBuchungContainerPanel = function()
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
        
        
        var leistungenLookup = new Ext.data.JsonStore({
            autoLoad:true,
            fields: [{name:'id'},{name:'leistung'}],
            url:'index.php',
            id:'leistungenLookup',
            baseParams: {cmd:'LeistungenGetList',mode:'lookup'},
            root:'results'
        });
        
        
        Ext.getCmp('containerToolbar').add({
           disabled:true,
           iconCls:'excel',
           tooltip:'Buchungsbesätigung als Excel downloaden',
           handler: function() {
               window.open("index.php?cmd=BuchungGetFile&PHPSESSID=" + Application.sessionId + "&type=excel&id_buchung="+Ext.getCmp('buchung_id').getValue(),'_blank');
           }
        },{
           disabled:true,
           iconCls:'pdf',
           tooltip:'Buchungsbesätigung als PDF downloaden',
           handler: function() {          
               window.open("index.php?cmd=BuchungGetFile&type=pdf&PHPSESSID=" + Application.sessionId + "&id_buchung=" + Ext.getCmp('buchung_id').getValue(),'_blank');
           }
        });
        
        
        
        //Stores für Comboboxen
        var begleitpersonenStore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'fullname'}],
            url:'index.php',
            id:'begleitpersonenStore',
            totalProperty:'total',
            baseParams: {cmd:'BegleitpersonGetList'},
            root:'results'
        });
        begleitpersonenStore.on('load',function() {
            Ext.getCmp('cmbBegleitperson1').setValue(Ext.getCmp('id_erste_ansprechperson').getValue());
            Ext.getCmp('cmbBegleitperson2').setValue(Ext.getCmp('id_zweite_ansprechperson').getValue());
        },this);
        
        
        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            title:'Buchungsdaten',
            labelWidth:140,
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
                name:'id_buchung',
                id: 'buchung_id',
                readOnly:true,
                fieldLabel:'Buchungsnummer'
            },{
                name:'id_angebotsvorlage',
                id:'id_angebotsvorlage',
                xtype:'hidden'
            },{
                name:'id_erste_ansprechperson',
                id:'id_erste_ansprechperson',
                xtype:'hidden'                
            },{
                name:'id_zweite_ansprechperson',
                id:'id_zweite_ansprechperson',
                xtype:'hidden'                
            },{
                name:'id_ausschreibung',
                id:'id_ausschreibung',
                xtype:'hidden'                
            },{
                name:'id_anfrage',
                id:'id_anfrage',
                xtype:'numberfield',
                fieldLabel:'Anfragenummer',
                readOnly:true
            },{
                name:'datum',
                id:'buchungsdatum',
                xtype:'xdatefield',
                format:'d.m.Y',
                fieldLabel:"Datum*"
            },{
                name:'buchungs_status',
                xtype:'combo',
                store: new Ext.data.ArrayStore({
                    autoDestroy: true,
                    storeId: 'statusstore',
                    idIndex: 0,  
                    fields: ['status'],
                    data:[['gebucht'],['bestätigt'],['abgeschlossen']]
                }),
                triggerAction:'all',
                mode:'local',
                lazyRender:true,
                forceSelection:true,
                valueField:'status',
                displayField:'status',
                fieldLabel:'Status*'
            },{
                name:'preis_schueler',
                readOnly:false,
                fieldLabel:'Preis Schüler'
            },{
                name:'preis_begleit',
                readOnly:false,
                fieldLabel:'Preis Begleitperson'
            },{
                name:'preis_bus',
                readOnly:false,
                fieldLabel:'Preis Bus'
            },{
                name:'abfahrtszeit_schule',
                readOnly:false,
                fieldLabel:'Abfahrtzeit Schule'
            },{
                name:'ankunftszeit_schule',
                readOnly:false,
                fieldLabel:'Ankunftszeit Schule'
            }]
        });
        
        this.tmpComponent.findById('rightfield').add({
            xtype:'fieldset',
            title:'Teilnehmer',
            labelWidth:140,
            defaults:{
                xtype:'numberfield',
                msgTarget: 'side',
                anchor:'90%',
                minValue:0,
                minText:'Bitte geben Sie einen Wert größer als {0} an.',
                maxValue:32767,
                maxText:'Der größtmögliche Wert für dieses Feld ist {0}',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                decimalPrecision:0,
                disabled:true
            },
            items:[{
                name:'name_klasse',
                xtype:'textfield',
                allowBlank:true,
                fieldLabel:'Klasse'
            },{
                xtype:'numberfield',
                name:'anzahl_weiblich',
                fieldLabel:'Anzahl weiblich*'
            },{
                xtype:'numberfield',
                name:'anzahl_maennlich',
                fieldLabel:'Anzahl männlich*'
            },{
                name:'anzahl_begleitpers_weiblich',
                allowBlank:true,
                fieldLabel:'Begleitperson weibl.*'
            },{
                name:'anzahl_begleitpers_maennlich',
                allowBlank:true,
                fieldLabel:'Begleitperson männl.*'
            },{
                name:'anzahl_vegetarier',
                allowBlank:true,
                fieldLabel:'Anzahl Vegetarier*'
            },{
                name:'anzahl_muslime',
                allowBlank:true,
                fieldLabel:'Anzahl Muslime*'
            },{
               name:'allergien',
               xtype:'textarea',
               fieldLabel:'Allergien',
               height:40
            }]
        });

        //Expanderplugin für HinweiseGrid
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><b>Notiz:</b><br />{text}</p>'
            )
        });
        
        //Store für die Leistungs-Combo
        var leistungenStore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'leistung'}],
            url:'index.php',
            storeId:'allLeistungenStore',
            totalProperty:'total',
            baseParams: {cmd:'LeistungenGetList'},
            root:'results'
        });
        leistungenStore.load({params:{start:0, limit: Application.PageSize}});

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'panel',
            title:'Kundendaten',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:#E3ECFA; padding-left:10px; padding-top:10px; padding-bottom:10px;',
            border:false,
            layout:'hbox',
            layoutConfig:{align:'stretch'},
            items:[{
                xtype:'form',
                id:'buchungsKundenDaten',
                bodyStyle:'padding:8px;',
                labelWidth:140,
                autoScroll:true,
                flex:1,
                title:'Schule',
                defaults:{
                    xtype:'textfield',
                    msgTarget: 'side',
                    anchor:'90%',
                    readOnly:true,
                    blankText:'Dieses Feld ist ein Pflichtfeld.'
                },
                items:[{
                    fieldLabel:'Name',
                    name:'name_schule'
                },{
                    fieldLabel: 'Straße',
                    name:'strasse_schule'
                },{
                    fieldLabel: 'PLZ',
                    name:'plz_schule'
                },{
                    fieldLabel: 'Ort',
                    name:'ort_schule'
                },{
                    fieldLabel: 'Telefon',
                    name:'telefon_schule'
                },{
                    fieldLabel: 'Fax',
                    name:'fax_schule'
                },{
                    fieldLabel: 'Mail',
                    name:'email_schule'
                }]
            },{
                xtype:'panel',
                flex:1,
                border:false,
                layout:'vbox',
                bodyStyle:'background:transparent;padding-left:10px; padding-right:10px;',
                layoutConfig:{align:'stretch'},
                items:[{
                    xtype:'form',
                    id:'buchungAp1',
                    bodyStyle:'padding:8px;',
                    labelWidth:140,
                    flex:1,
                    autoScroll:true,
                    title:'Ansprechperson1',
                    defaults:{
                        xtype:'textfield',
                        msgTarget: 'side',
                        anchor:'90%',
                        readOnly:true,
                        blankText:'Dieses Feld ist ein Pflichtfeld.'
                    },
                    items:[{
                        fieldLabel:'Name',
                        xtype:'combo',
                        editable: false,
                        readOnly:false,
                        allowBlank:false,
                        triggerAction: 'all',
                        id:'cmbBegleitperson1',
                        listeners:{
                            select:function(cmb,rec,index) {
                                Ext.getCmp('id_erste_ansprechperson').setValue(rec.data.id);
                                Ext.getCmp('buchungAp1').setTitle('Ansprechperson1 - <b style="color:red;">ungespeichert</b>');
                                Ext.getCmp('buchungAp1').getForm().load({
                                    params:{cmd:'BegleitpersonLoad',id_begleitperson:rec.data.id}
                                });
                            }
                        },
                        mode:'local',
                        store: begleitpersonenStore,
                        valueField: 'id',
                        displayField: 'fullname',
                        name: 'begleitperson',
                        hiddenName:'id_begleitperson'
                    },{
                        fieldLabel:'Straße',
                        name:'strasse'
                    },{
                        fieldLabel:'PLZ',
                        name:'plz'
                    },{
                        fieldLabel:'Ort',
                        name:'ort'
                    },{
                        fieldLabel:'Telefon',
                        name:'tel'
                    },{
                        fieldLabel:'Mobil',
                        name:'mobil'
                    },{
                        fieldLabel:'Mail',
                        name:'email'
                    }]
                },{
                    xtype:'panel',
                    height:10,
                    bodyStyle:'background:transparent;',
                    border:false
                },{
                    xtype:'form',
                    id:'buchungAp2',
                    bodyStyle:'padding:8px;',
                    labelWidth:140,
                    autoScroll:true,
                    flex:1,
                    title:'Ansprechperson2',
                    defaults:{
                        xtype:'textfield',
                        msgTarget: 'side',
                        anchor:'90%',
                        readOnly:true,
                        blankText:'Dieses Feld ist ein Pflichtfeld.'
                    },
                    items:[{
                        fieldLabel:'Name',
                        xtype:'combo',
                        editable: false,
                        readOnly:false,
                        allowBlank:false,
                        triggerAction: 'all',
                        id:'cmbBegleitperson2',
                        listeners:{
                            select:function(cmb,rec,index) {
                                Ext.getCmp('id_zweite_ansprechperson').setValue(rec.data.id);
                                Ext.getCmp('buchungAp2').setTitle('Ansprechperson2 - <b style="color:red;">ungespeichert</b>');
                                Ext.getCmp('buchungAp2').getForm().load({
                                    params:{cmd:'BegleitpersonLoad',id_begleitperson:rec.data.id}
                                });
                            }
                        },
                        mode:'local',
                        store: begleitpersonenStore,
                        valueField: 'id',
                        displayField: 'fullname',
                        name: 'begleitperson',
                        hiddenName:'id_begleitperson'
                    },{
                        fieldLabel:'Straße',
                        name:'strasse'
                    },{
                        fieldLabel:'PLZ',
                        name:'plz'
                    },{
                        fieldLabel:'Ort',
                        name:'ort'
                    },{
                        fieldLabel:'Telefon',
                        name:'tel'
                    },{
                        fieldLabel:'Mobil',
                        name:'mobil'
                    },{
                        fieldLabel:'Mail',
                        name:'email'
                    }]
                }]
            }]
        },{
            xtype:'panel',
            title:'Zeitplan',
            id:'zeitplanpanel',
            autoScroll:true,
            layout:'vbox',
            layoutConfig:{align:'stretch'},
            headerAsText:false,
            bodyStyle:'background:transparent;',
            border:false,
            items:[{
                xtype:'editorgrid',
                id:'echtLeistungenGrid',
                tbar:[{
                    iconCls:'add',
                    disabled:true,
                    id:'echtleistungAdd',
                    tooltip:'Leistung hinzufügen',
                    handler: function() {
                        var Leistungen = Ext.StoreMgr.get('zeitpunkteStore').recordType;
                        var l = new Leistungen({
                            icon:"<img src='Resources/images/16x16/product16.png' alt='pic' />",
                            id_leistungen:0
                        });
                        Ext.getCmp('echtLeistungenGrid').stopEditing();
                        Ext.StoreMgr.get('zeitpunkteStore').insert(0, l);
                        Ext.getCmp('echtLeistungenGrid').startEditing(0, 0);
                    }
                },{
                    iconCls:'delete',
                    disabled:true,
                    id:'echtleistungDel',
                    tooltip:'Leistung löschen',
                    handler: function() {
                        var recordToDel = Ext.getCmp('echtLeistungenGrid').getSelectionModel().getSelected();
                        Ext.StoreMgr.get('zeitpunkteStore').remove(recordToDel);
                    }
                },'->','Quartier:&nbsp;',{
                    xtype:'combo',
                    editable: false,
                    width:200,
                    triggerAction: 'all',
                    pageSize: Application.PageSize,
                    id:'cmbQuartier',
                    listeners:{
                        select:function(cmb,rec,index) {
                           
                        }
                    },
                    mode:'local',
                    store: new Ext.data.JsonStore({
                        fields: [{name:'id_quartier'},{name:'quartier_name'}],
                        url:'index.php',
                        storeId:'quartierStore',
                        totalProperty:'total',
                        baseParams: {cmd:'QuartiereGetListByBuchung'},
                        root:'results'
                    }),
                    valueField: 'id_quartier',
                    displayField: 'quartier_name'
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
                    storeId: 'zeitpunkteStore',
                    baseParams: {cmd:'LeistungenGetByAngebotsvorlage'},
                    root:'results',
                    fields: ['icon','id_leistungen','leistungsname','echt_preis','echt_uhrzeit',
                        {name:'echt_datum',type:'date',dateFormat:'Y-m-d'}]
                }),
                sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
                columns:[
                    {header:'',dataIndex:'icon',width:40},
                    {
                        header:'Leistung',
                        dataIndex:'id_leistungen',
                        width:230,
                        editor: {
                            xtype:'combo',
                            //editable: false,
                            //allowBlank:false,
                            typeAhead: false,
                            hideTrigger:true,
                            forceSeletion: true,
                            listConfig: {
                                loadingText:'Suche...',
                                emptyText:'Keine Leistung gefunden'
                            },
                            pageSize: Application.PageSize,
                            minChars:2,
                            id:'cmbLeistungenInGrid',
                            //triggerAction: 'all',
                            //mode:'local',
                            store: leistungenStore,
                            valueField: 'id',
                            displayField: 'leistung'
                        },
                        renderer:function(value,meta,rec,row,col,store) {
                            var dataset = leistungenLookup.getAt(leistungenLookup.find('id',value));
                            if(dataset != undefined) return dataset.data.leistung;
                            else return '';
                        }
                    },
                    {xtype:'datecolumn',format:'d.m.Y',header:'Datum',dataIndex:'echt_datum',width:120,editor:{xtype:'datefield',format:'d.m.Y'}},
                    {header:'Uhrzeit',dataIndex:'echt_uhrzeit',width:120,editor:{xtype:'timefield', format:'H:i:s',increment:10}}
                ]
            }]
        },{
            xtype:'panel',
            title:'Busausschreibung',
            tbar:['->','Ausschreibung:&nbsp;',{
                xtype:'combo',
                editable: false,
                width:200,
                triggerAction: 'all',
                pageSize: Application.PageSize,
                id:'cmbBusunternehmen',
                listeners:{
                    select:function(cmb,rec,index) {
                       Ext.getCmp('bustourForm').getForm().load({
                          url:'index.php',
                          method:'POST',
                          params:{
                              cmd:'BusausschreibungLoad',
                              id_ausschreibung:rec.data.id
                          }
                       });
                    }
                },
                mode:'local',
                store: new Ext.data.JsonStore({
                    fields: [{name:'id'},{name:'idtext'}],
                    url:'index.php',
                    storeId:'ausschreibungsStore',
                    autoLoad: {params:{usefilter:false,start:0,limit:Application.PageSize}},
                    totalProperty:'total',
                    baseParams: {cmd:'BusausschreibungGetList'},
                    root:'results'
                }),
                valueField: 'id',
                displayField: 'idtext'
            },{
                iconCls:'deny',
                tooltip:'Ausschreibung von Buchung entfernen',
                handler:function() {
                    Ext.getCmp('cmbBusunternehmen').setValue("");
                    Ext.getCmp('bustourForm').getForm().reset();
                }
            }],
            layout:'fit',
            bodyStyle:'background:#E3ECFA;padding:10px;',
            items:[{
                xtype:'form',
                id:'bustourForm',
                title:'verknüpfte Bustour',
                autoScroll:true,
                labelWidth:170,
                bodyStyle:'background:#fff; padding:15px;',
                defaults:{xtype:'textfield', anchor:'96%', msgTarget: 'side', readOnly:true},
                items:[{
                    fieldLabel:'Ausschreibungs-Nr',
                    id:'id_ausschreibung_xx',
                    name:'id_ausschreibung'
                },{
                    fieldLabel:'Kurztext',
                    name:'kurztext'
                },{
                    fieldLabel:'Busunternehmen',
                    name:'name_busunternehmen'
                },{
                    fieldLabel:'Tel Busunternehmen',
                    name:'tel'
                },{
                    fieldLabel:'Adresse Busunternehmer',
                    name:'strasse'
                },{
                    name:'plz'
                },{
                    name:'ort'
                },{
                    fieldLabel:'Name Fahrer',
                    name:'name_fahrer'
                },{
                    fieldLabel:'Handy Fahrer',
                    name:'handy_fahrer'
                },{
                    fieldLabel:'Preis',
                    name:'preisvorschlag'
                },{
                    xtype:'textarea',
                    fieldLabel:'Tourbeschreibung',
                    name:'bemerkung'
                }]
            }]
        },{
            xtype:'grid',
            title:'Notizen',
            tbar:[{
                iconCls:'add',
                id:'notizAddButton',
                disabled:true,
                tooltip:'Notiz hinzufügen',
                handler: function() {
                    Ext.Msg.prompt('Notiz', 'Bitte den Notiztext eingeben:', function(btn, text){
                        if (btn == 'ok'){
                            Ext.Ajax.request({
                               url:'index.php',
                               params:{
                                   cmd:'BuchungshinweisSave',
                                   text:text,
                                   id_buchung:Ext.getCmp('buchung_id').getValue()
                               },
                               success: function() {
                                    Ext.StoreMgr.get('hinweiseStore').load({params:{id_buchung:Ext.getCmp('buchung_id').getValue()}});
                               }
                            });
                        }
                    },this,true);

                }
            }],
            border:false,
            stripeRows: true,
            viewConfig: {
                forceFit:true
            },
            animCollapse: false,
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: 'index.php',
                    method: 'POST'
                }),
                storeId:'hinweiseStore',
                baseParams:{
                    cmd: "BuchungshinweiseGetList"
                },
                reader: new Ext.data.JsonReader({
                    root: 'results',
                    totalProperty: 'total'
                },Ext.data.Record.create([
                     {name: 'id', type:'int'},
                     {name: 'datum', type:'date', dateFormat: 'Y-m-d'},
                     {name: 'text', type:'string'},
                     {name: 'user', type:'string'}
                  ])
                )
            }),
            columns: [
                expander,
                {header: "Datum", width: 30, sortable: true, xtype: 'datecolumn', format: 'd.m.Y', dataIndex: 'datum'},
                {header: "Notiz ist von...", width: 135, sortable: false, dataIndex: 'user'}
            ],
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),
            plugins: expander
        },{
            xtype:'panel',
            layout:'form',
            title:'Sonstiges',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:transparent; padding:15px;',
            border:false,
            labelWidth:170,
            defaults:{xtype:'textfield',anchor:'95%', msgTarget:'side'},
            items:[{
                name:'letzter_bearbeiter',
                readOnly:true,
                id:'sonstigeId1',
                fieldLabel:'letzter Bearbeiter'
            },{
                name:'letzte_bearbeitung',
                xtype:'xdatefield',
                format:'d.m.Y',
                hideTrigger:true,
                readOnly:true,
                id:'sonstigeId2',
                fieldLabel:'letzte Bearbeitung'
            }]
        });
        tabarea.setActiveTab(0);
        
        formarea.getForm().add(Ext.getCmp('sonstigeId1'));
        formarea.getForm().add(Ext.getCmp('sonstigeId2'));


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
            Ext.getCmp('formheaddisplay').setValue('');
            Ext.getCmp('formarea').getForm().submit({
                url: 'index.php',
                success: function(response,options) {
                    Ext.example.msg('Erfolg', 'Buchung gespeichert.');
                    Ext.getCmp('buchungAp1').setTitle('Ansprechperson1');
                    Ext.getCmp('buchungAp2').setTitle('Ansprechperson2');
                    Ext.getCmp('buchungauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {
                    cmd: 'BuchungSave',
                    id_angebotsvorlage:Ext.getCmp('id_angebotsvorlage').getValue(),
                    id_erste_ansprechperson: Ext.getCmp('id_erste_ansprechperson').getValue(),
                    id_zweite_ansprechperson: Ext.getCmp('id_zweite_ansprechperson').getValue(),
                    id_ausschreibung: Ext.getCmp('id_ausschreibung_xx').getValue(),
                    id_quartier: Ext.getCmp('cmbQuartier').getValue(),
                    anmerkung_kunde:''
                }
            });

            var storeValues = "";
            var echtleistungenStr = Ext.StoreMgr.get('zeitpunkteStore');
            var count = 0;
            echtleistungenStr.each(function(item) {
                if(item.data.id_leistungen != 0)
                {
                    var mydatum = (item.data.echt_datum != undefined) ? new Date(item.data.echt_datum).format("Y-m-d") : Ext.getCmp('buchungsdatum').getValue().format("Y-m-d");
                    var myuhrzeit = (item.data.echt_uhrzeit != undefined) ? item.data.echt_uhrzeit : "08:00:00";

                    if(count != 0) storeValues = storeValues + "@@";
                    storeValues = storeValues + item.data.id_leistungen+"|"+myuhrzeit+"|"+mydatum;
                    count = count + 1;
                }
            });
            

            Ext.Ajax.request({
               url:'index.php',
               params: {
                   cmd:'EchtleistungenSave',
                   id_buchung:Ext.getCmp('buchung_id').getValue(),
                   storeValues:storeValues
               },
               method:'POST',
               success: function() {},
               failure: function (){}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_buchung_load = Ext.getCmp('buchung_id').getValue();
            if(id_buchung_load != '0')
            {
                Ext.getCmp('formarea').getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Buchung wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                    waitMsg:'Laden...',
                    waitTitle:'Buchung laden',
                    params: {cmd: 'BuchungLoad', id_buchung: id_buchung_load}
                });
            }
            else
            {
                controller.tmpComponent.getForm().reset();
                controller.disableAllChilds();
                controller.disableAllToolbarButtons();
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