Ext.ux.WindowTakeOver = Ext.extend(Ext.Window, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.WindowTakeOver.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        var window = this;

        //Die ID's der Ansprechpersonen, die auf die Buchung gespeichert werden
        var AP_ID1 = 0;
        var AP_ID2 = 0;
        var K_ID = 0;

        //STORES
        var SuggestionStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'index.php',
                method: 'POST'
            }),
            remoteSort:true,
            baseParams:{
                cmd: "KundeGetList",
                usefilter:true,
                searchplz:Ext.getCmp('plz_schule').getValue(),
                searchname:this.Controller.rec.data.schule
            },
            reader: new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total'
            },Ext.data.Record.create([
                {name: 'id', type:'int'},
                {name: 'name_schule', type:'string'},
                {name: 'plz_schule', type:'string'},
                {name: 'ort_schule', type:'string'}
                ])
            )
        });
        SuggestionStore.load({params:{start:0, limit:8}});

        var AnsprechpersonenStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'index.php',
                method: 'POST'
            }),
            remoteSort:true,
            baseParams:{
                cmd: "BegleitpersonGetList"
            },
            reader: new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total'
            },Ext.data.Record.create([
                {name: 'id', type:'int'},
                {name: 'nachname', type:'string'},
                {name: 'vorname', type:'string'},
                {name: 'plz', type:'string'}
                ])
            )
        });

        //GRIDS
        var SuggestionGrid = new Ext.grid.GridPanel({
            title:'Vorschläge für bereits bestehende Kunden',
            id:'SuggestionGrid',
            border:false,
            store: SuggestionStore,
            columns: [
                {header: "Name", width: 140, sortable: false, dataIndex: 'name_schule'},
                {header: "PLZ", width: 65, sortable: false, dataIndex: 'plz_schule'},
                {header: "Ort", width: 120, sortable: false, dataIndex: 'ort_schule'}
            ],
            stripeRows: true,
            flex:1,
            viewConfig: {
                forceFit:true
            },
            tbar: new Ext.Toolbar({
                items:['->',{
                    xtype:'button',
                    id:'btnAlle',
                    handler: function(b) {
                        SuggestionStore.setBaseParam('usefilter', !Ext.getCmp('btnAlle').pressed);
                        SuggestionStore.load({params:{start:0, limit:8}});
                    },
                    enableToggle: true,
                    width: 50,
                    tooltip:'alle',
                    text:'alle Kunden'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 8,
                store: SuggestionStore,
                displayInfo: true
            }),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })
        });

        var AnsprechpersonenGrid = new Ext.grid.GridPanel({
            title:'bestehende Ansprechpersonen',
            id:'AnsprechpersonenGrid',
            store: AnsprechpersonenStore,
            border:false,
            columns: [
                {header: "Nachname", width: 145, sortable: false, dataIndex: 'nachname'},
                {header: "Vorname", width: 130, sortable: false, dataIndex: 'vorname'},
                {header: "PLZ", width: 90, sortable: false, dataIndex: 'plz'}
            ],
            stripeRows: true,
            flex:1,
            viewConfig: {
                forceFit:true
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })
        });

        var Ansprechpersonen2Grid = new Ext.grid.GridPanel({
            title:'bestehende Ansprechpersonen',
            id:'Ansprechpersonen2Grid',
            store: AnsprechpersonenStore,
            border:false,
            columns: [
                {header: "Nachname", width: 145, sortable: false, dataIndex: 'nachname'},
                {header: "Vorname", width: 130, sortable: false, dataIndex: 'vorname'},
                {header: "PLZ", width: 90, sortable: false, dataIndex: 'plz'}
            ],
            stripeRows: true,
            flex:1,
            viewConfig: {
                forceFit:true
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })
        });


        var anfrageFormValues = Ext.getCmp('anfrageForm').getForm().getFieldValues();


        //FORMS
        var kundenForm = new Ext.form.FormPanel({
            id:'uebernehmenFormKunde',
            defaultType: 'textfield',
            labelWidth:130,
            border:false,
            title:'neuer Kunde',
            flex:1,
            bodyStyle:'padding:10px',
            defaults: {anchor:'95%'},
            labelAlign: 'left',
            items:[{
                name:'name_schule',
                maxLength:45,
                value:anfrageFormValues.name_schule,
                allowBlank:false,
                //readOnly:true,
                fieldLabel:'Name der Schule*'
            },{
                name:'strasse_schule',
                maxLength:45,
                value:anfrageFormValues.strasse_schule,
                //readOnly:true,
                allowBlank:false,
                fieldLabel:'Straße Schule*'
            },{
                name:'plz_schule',
                value:anfrageFormValues.plz_schule,
                maxLength:6,
                //readOnly:true,
                allowBlank:false,
                fieldLabel:'PLZ Schule*'
            },{
                name:'ort_schule',
                value:anfrageFormValues.ort_schule,
                maxLength:45,
                //readOnly:true,
                allowBlank:false,
                fieldLabel:'Ort Schule*'
            },{
                name:'telefon_schule',
                value:anfrageFormValues.telefon_schule,
                maxLength:45,
                //readOnly:true,
                fieldLabel:'Telefonnummer Schule'
            },{
                name:'fax_schule',
                value:anfrageFormValues.fax_schule,
                maxLength:45,
                //readOnly:true,
                fieldLabel:'Faxnummer Schule'
            },{
                name:'email_schule',
                value:anfrageFormValues.email_schule,
                vtype:'email',
                maxLength:45,
                //readOnly:true,
                fieldLabel:'e-Mail Schule'
            }],
            buttons:[{
                text:'Neuer Kunde',
                handler: function() {
                    Ext.getCmp('uebernehmenFormKunde').getForm().submit({
                        waitTitle:'Connecting',
                        waitMsg:'updating data...',
                        url: 'index.php',
                        scope:this,
                        params: {
                            cmd:"KundeSave",
                            bemerkung:'',
                            id_kunde:0
                        },
                        failure:function(form,action){
                            Ext.example.msg('Neuer Kunde', 'Nicht übernommen! Ein unbekannter Fehler ist aufgetreten!');
                        },
                        success:function(form,action)
                        {
                            var responseData = Ext.decode(action.response.responseText);
                            if(responseData.success == true) {
                                Ext.example.msg('Neuer Kunde', 'Kunde erfolgreich angelegt!');
                                K_ID = responseData.neueID;

                                Ext.Ajax.request({		//hier wird der AJAX-Call für die 1. Ansprechperson abgesetzt.
                                    waitTitle:'Connecting',
                                    waitMsg:'updating data...',
                                    scope:this,
                                    url: 'index.php',
                                    params: {
                                        cmd:"BegleitpersonSave",
                                        id_begleitperson:0,
                                        id_kunde:responseData.neueID,
                                        vorname:anfrageFormValues.vorname_begleitperson1,
                                        nachname:anfrageFormValues.nachname_begleitperson1,
                                        mobil:anfrageFormValues.mobil_begleitperson1,
                                        email:anfrageFormValues.email_begleitperson1,
                                        strasse:anfrageFormValues.strasse_begleitperson1,
                                        plz:anfrageFormValues.plz_begleitperson1,
                                        ort:anfrageFormValues.ort_begleitperson1,
                                        tel:anfrageFormValues.tel_begleitperson1,
                                        bemerkung:''
                                    },
                                    failure:function(response,options){
                                        Ext.example.msg('Neuer Kunde', 'Nicht übernommen! Error Occured!');
                                    },
                                    success:function(response,options){
                                        var responseDataNew = Ext.decode(response.responseText);
                                        if(responseDataNew.success == true) {
                                            Ext.example.msg('Neue Ansprechperson', 'Ansprechperson erfolgreich angelegt!');
                                            AP_ID1 = responseDataNew.neueID;

                                            //NOCHMALS, MIT AP_ID2
                                            if(anfrageFormValues.nachname_begleitperson2 != '')
                                            {
                                                Ext.Ajax.request({		//hier wird der AJAX-Call für die 2. Ansprechperson abgesetzt.
                                                    waitTitle:'Connecting',
                                                    waitMsg:'updating data...',
                                                    scope:this,
                                                    url: 'index.php',
                                                    params: {
                                                        cmd:"BegleitpersonSave",
                                                        id_begleitperson:0,
                                                        id_kunde:responseData.neueID,
                                                        vorname:anfrageFormValues.vorname_begleitperson2,
                                                        nachname:anfrageFormValues.nachname_begleitperson2,
                                                        mobil:anfrageFormValues.mobil_begleitperson2,
                                                        tel:anfrageFormValues.tel_begleitperson2,
                                                        email:anfrageFormValues.email_begleitperson2,
                                                        strasse:anfrageFormValues.strasse_begleitperson2,
                                                        plz:anfrageFormValues.plz_begleitperson2,
                                                        ort:anfrageFormValues.ort_begleitperson2,
                                                        bemerkung:''
                                                    },
                                                    failure:function(response,options){
                                                        Ext.example.msg('Neuer Kunde', 'Nicht übernommen! Error Occured!');
                                                    },
                                                    success:function(response,options){
                                                        var responseData = Ext.decode(response.responseText);
                                                        if(responseData.success == true) {
                                                            Ext.example.msg('Neue Ansprechperson', 'Ansprechperson2 erfolgreich angelegt!');
                                                            BuchungsForm.enable();
                                                            AP_ID2 = responseData.neueID;
                                                            UebernehmenTabpanel.setActiveTab(3);
                                                            kundenCombination.disable();
                                                        } else {
                                                            Ext.example.msg('Ansprechperson', 'Es ist ein Fehler beim Anlegen der Ansprechperson2 aufgetreten!');
                                                        }
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                BuchungsForm.enable();
                                                UebernehmenTabpanel.setActiveTab(3);
                                                kundenCombination.disable();
                                            }
                                        } else {
                                            Ext.example.msg('Ansprechperson', 'Es ist ein Fehler beim Anlegen der Ansprechperson1 aufgetreten!');
                                        }
                                    }
                                });

                            } else {
                                Ext.example.msg('Kunden', 'Fehler beim Speichern des Kunden!');
                            }
                        }
                    });
                }
            },{
                text:'Bestehender Kunde',
                handler: function() {
                    if(SuggestionGrid.getSelectionModel().hasSelection() == false) {
                        Ext.example.msg('Kein Vorschlag ausgewählt', 'Bitte wählen Sie einen der Vorschläge aus!');
                    } else {
                        Ext.example.msg('Mergen', 'Kunde erfolgreich zugewiesen!');
                        AnsprechpersonenCombination.enable();
                        AnsprechpersonenStore.load({params:{id_kunde:SuggestionGrid.getSelectionModel().getSelected().data.id,usefilter:false}});
                        K_ID = SuggestionGrid.getSelectionModel().getSelected().data.id;
                        UebernehmenTabpanel.setActiveTab(1);
                        kundenCombination.disable();
                    }
                }
            }]
        });


        var AnsprechpersonenForm = new Ext.form.FormPanel({
            id:'AnsprechpersonForm',
            defaultType: 'textfield',
            title:'neue Ansprechperson',
            flex:1,
            border:false,
            bodyStyle:'padding:10px',
            defaults: {
                anchor:'93%'
            },
            labelAlign: 'left',
            items:[{
                fieldLabel: 'Vorname*',
                value:anfrageFormValues.vorname_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'vorname'
            },{
                fieldLabel: 'Nachname*',
                value:anfrageFormValues.nachname_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'nachname'
            },{
                fieldLabel: 'Telefon*',
                value:anfrageFormValues.tel_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'tel'
            },{
                fieldLabel: 'Handy',
                value:anfrageFormValues.mobil_begleitperson1,
                maxLength:45,
                //readOnly:true,
                name: 'mobil'
            },{
                fieldLabel: 'eMail*',
                value:anfrageFormValues.email_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'email'
            },{
                fieldLabel: 'Straße*',
                value:anfrageFormValues.strasse_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'strasse'
            },{
                fieldLabel: 'PLZ*',
                value:anfrageFormValues.plz_begleitperson1,
                allowBlank:false,
                maxLength:6,
                //readOnly:true,
                name: 'plz'
            },{
                fieldLabel: 'Ort*',
                value:anfrageFormValues.ort_begleitperson1,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'ort'
            }],
            buttons:[{
                text:'Neue Ansprechperson',
                handler: function() {
                    Ext.getCmp('AnsprechpersonForm').getForm().submit({		//hier wird der AJAX-Call abgesetzt.
                        waitTitle:'Connecting',
                        waitMsg:'updating data...',
                        url: 'index.php',
                        params: {
                            cmd:"BegleitpersonSave",
                            id_begleitperson:0,
                            id_kunde:SuggestionGrid.getSelectionModel().getSelected().data.id,
                            bemerkung:''
                        },
                        failure:function(form,action){
                            Ext.example.msg('Neue Ansprechperson', 'Ein unbekannter Fehler ist beim Speichern der neuen Ansprechperson 1 aufgetreten.');
                        },
                        success:function(form,action){
                            var responseData = Ext.decode(action.response.responseText);
                            if(responseData.success == true) {
                                Ext.example.msg('Neue Ansprechperson', 'Ansprechperson 1 erfolgreich angelegt!');
                                //Ext.getCmp('BuchungsForm').getForm().loadRecord(rec);
                                AP_ID1 = responseData.neueID;
                                if(anfrageFormValues.nachname_begleitperson2 != "")
                                {
                                    Ext.getCmp('Ansprechpersonen2Combination').enable();
                                    UebernehmenTabpanel.setActiveTab(2);
                                    AnsprechpersonenCombination.disable();
                                }
                                else
                                {
                                    Ext.getCmp('BuchungsForm').enable();
                                    UebernehmenTabpanel.setActiveTab(3);
                                    AnsprechpersonenCombination.disable();
                                }
                            } else {
                                Ext.example.msg('Ansprechperson', 'Ein Fehler ist beim Speichern der Ansprechperson 1 aufgetreten!');
                            }
                        }
                    });
                }
            },{
                text:'Bestehende Ansprechperson',
                handler: function() {
                    if(AnsprechpersonenGrid.getSelectionModel().hasSelection() == false) {
                        Ext.example.msg('Keine Person ausgewählt', 'Bitte wählen Sie eine der Ansprechpersonen aus!');
                    } else {
                        Ext.example.msg('Ansprechperson', 'Ansprechperson erfolgreich gewählt!');
                        AP_ID1 = AnsprechpersonenGrid.getSelectionModel().getSelected().data.id;

                        if(anfrageFormValues.nachname_begleitperson2 != "")
                        {
                            Ext.getCmp('Ansprechpersonen2Combination').enable();
                            UebernehmenTabpanel.setActiveTab(2);
                            AnsprechpersonenCombination.disable();
                        }
                        else
                        {
                            Ext.getCmp('BuchungsForm').enable();
                            UebernehmenTabpanel.setActiveTab(3);
                            AnsprechpersonenCombination.disable();
                        }
                    }
                }
            }]
        });


        var Ansprechpersonen2Form = new Ext.form.FormPanel({
            id:'Ansprechperson2Form',
            defaultType: 'textfield',
            title:'neue Ansprechperson',
            flex:1,
            border:false,
            bodyStyle:'padding:10px',
            defaults: {
                anchor:'93%'
            },
            labelAlign: 'left',
            items:[{
                fieldLabel: 'Vorname',
                value:anfrageFormValues.vorname_begleitperson2,
                maxLength:45,
                //readOnly:true,
                name: 'vorname'
            },{
                fieldLabel: 'Nachname*',
                value:anfrageFormValues.nachname_begleitperson2,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'nachname'
            },{
                fieldLabel: 'Telefon',
                value:anfrageFormValues.tel_begleitperson2,
                maxLength:45,
                //readOnly:true,
                name: 'tel'
            },{
                fieldLabel: 'Handy',
                value:anfrageFormValues.mobil_begleitperson2,
                maxLength:45,
                //readOnly:true,
                name: 'mobil'
            },{
                fieldLabel: 'eMail',
                value:anfrageFormValues.email_begleitperson2,
                maxLength:45,
                //readOnly:true,
                name: 'email'
            },{
                fieldLabel: 'Straße*',
                value:anfrageFormValues.strasse_begleitperson2,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'strasse'
            },{
                fieldLabel: 'PLZ*',
                value:anfrageFormValues.plz_begleitperson2,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'plz'
            },{
                fieldLabel: 'Ort*',
                value:anfrageFormValues.ort_begleitperson2,
                allowBlank:false,
                maxLength:45,
                //readOnly:true,
                name: 'ort'
            }],
            buttons:[{
                text:'Neue Ansprechperson',
                handler: function() {
                    Ext.getCmp('Ansprechperson2Form').getForm().submit({		//hier wird der AJAX-Call abgesetzt.
                        waitTitle:'Connecting',
                        waitMsg:'updating data...',
                        url: 'index.php',
                        params: {
                            cmd:"BegleitpersonSave",
                            id_begleitperson:0,
                            id_kunde:SuggestionGrid.getSelectionModel().getSelected().data.id,
                            bemerkung:''
                        },
                        failure:function(form,action){
                            Ext.example.msg('Neue Ansprechperson', 'Ein unbekannter Fehler ist beim Speichern der neuen Ansprechperson 2 aufgetreten.');
                        },
                        success:function(form,action){
                            var responseData = Ext.decode(action.response.responseText);
                            if(responseData.success == true) {
                                Ext.example.msg('Neue Ansprechperson', 'Ansprechperson 2 erfolgreich angelegt!');
                                Ext.getCmp('BuchungsForm').enable();
                                AP_ID2 = responseData.neueID;
                                UebernehmenTabpanel.setActiveTab(3);
                                Ansprechpersonen2Combination.disable();
                            } else {
                                Ext.example.msg('Ansprechperson', 'Ein Fehler ist beim Speichern der Ansprechperson 2 aufgetreten!');
                            }
                        }
                    });
                }
            },{
                text:'Bestehende Ansprechperson',
                handler: function() {
                    if(AnsprechpersonenGrid.getSelectionModel().hasSelection() == false) {
                        Ext.example.msg('Keine Person ausgewählt', 'Bitte wählen Sie eine der Ansprechpersonen aus!');
                    } else {
                        Ext.example.msg('Ansprechperson', 'Ansprechperson2 erfolgreich gewählt!');
                        BuchungsForm.enable();
                        AP_ID2 = Ansprechpersonen2Grid.getSelectionModel().getSelected().data.id;
                        UebernehmenTabpanel.setActiveTab(3);
                        Ansprechpersonen2Combination.disable();
                    }
                }
            }]
        });

        var BuchungsFieldset1 = new Ext.form.FieldSet({
            labelAlign: 'left',
            layout:'form',
            labelWidth:130,
            border:false,
            flex:1,
            defaults: {anchor:'100%'},
            bodyStyle:'padding:10px',
            defaultType: 'textfield',
            border: false,
            items:[{
                fieldLabel: 'ID Anfrage',
                value:anfrageFormValues.id_anfrage,
                readOnly:true,
                name: 'id_anfrage'
            },{
                fieldLabel:'Angebot',
                value:Ext.getCmp('cmbAngebotsvorlagen').getRawValue(),
                readOnly:true,
                name:'angebotsname'
            },{
                fieldLabel:'Klasse',
                value:anfrageFormValues.name_klasse,
                maxLength:45,
                //readOnly:true,
                name:'name_klasse'
            },{
                fieldLabel: 'Datum*',
                value:Ext.StoreMgr.get('turnuslookup').getAt(Ext.StoreMgr.get('turnuslookup').find("id",anfrageFormValues.id_turnus)).get('datum'),
                //hideTrigger:true,
                format: 'd.m.Y',
                allowBlank:false,
                xtype:'xdatefield',
                //readOnly:true,
                name:'datum'
            },{
                fieldLabel: 'Bemerkung',
                value:anfrageFormValues.anmerkung,
                //readOnly:true,
                xtype:'textarea',
                name: 'anmerkung_kunde'
            },{
               fieldLabel:'Allergien',
               value:anfrageFormValues.allergien,
               xtype:'textarea',
               name:'allergien'
            }]
        });

        var BuchungsFieldset2 = new Ext.form.FieldSet({
            labelAlign: 'left',
            labelWidth:130,
            layout:'form',
            border:false,
            flex:1,
            defaults: {anchor:'100%'},
            bodyStyle:'padding:10px',
            defaultType: 'textfield',
            border: false,
            items:[{
                fieldLabel: 'Anzahl Weiblich*',
                value:anfrageFormValues.anzahl_weiblich,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_weiblich'
            },{
                fieldLabel: 'Anzahl Männlich*',
                value:anfrageFormValues.anzahl_maennlich,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_maennlich'
            },{
                fieldLabel: 'Anzahl Begleit weibl.*',
                value:anfrageFormValues.anzahl_begleit_weiblich,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_begleitpers_weiblich'
            },{
                fieldLabel: 'Anzahl Begleit männl.*',
                value:anfrageFormValues.anzahl_begleit_maennlich,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_begleitpers_maennlich'
            },{
                fieldLabel: 'Vegetarier*',
                value:anfrageFormValues.anzahl_vegetarier,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_vegetarier'
            },{
                fieldLabel: 'Muslime*',
                value:anfrageFormValues.anzahl_muslime,
                allowBlank:false,
                //readOnly:true,
                name: 'anzahl_muslime'
            }]
        });


        var BuchungsForm = new Ext.form.FormPanel({
            disabled:true,
            id:'BuchungsForm',
            title:'Buchung',
            layout:'hbox',
            border:false,
            layoutConfig:{align:'stretch'},
            items:[BuchungsFieldset1,BuchungsFieldset2],
            buttons:[{
                text:'Buchung übernehmen',
                handler: function() {
                    Ext.getCmp('BuchungsForm').getForm().submit({
                        waitTitle:'Connecting',
                        waitMsg:'updating data...',
                        url: 'index.php',
                        params: {
                            cmd:"BuchungSave",
                            buchungs_status:'gebucht',
                            id_buchung:0, 
                            id_ausschreibung:0,
                            id_quartier:0,
                            id_erste_ansprechperson: AP_ID1,
                            id_zweite_ansprechperson: AP_ID2,
                            id_angebotsvorlage: anfrageFormValues.id_angebotsvorlage
                        },
                        failure:function(form,action){
                            Ext.example.msg('Buchung', 'Nicht übernommen! Error Occured!');
                        },
                        success:function(form,action){
                            var responseData = Ext.decode(action.response.responseText);
                            if(responseData.success == true) {
                                window.close();
                                Ext.Ajax.request({
                                   url:'index.php',
                                   params:{
                                       cmd:'BuchungshinweisSave',
                                       text:anfrageFormValues.anmerkung,
                                       id_buchung:responseData.neueID
                                   },
                                   success: function() {}
                                });
                                Ext.example.msg('Buchung', 'Buchung erfolgreich gespeichert');
                                Ext.Ajax.request({
                                   url:'index.php',
                                   params:{
                                       cmd:'AnfrageDel',
                                       id: anfrageFormValues.id_anfrage
                                   },
                                   success: function() {
                                       Ext.example.msg('Anfrage', 'Anfrage wurde gelöscht und ist nur mehr über die Archivsuche erreichbar.');
                                   }
                                });
                            } else {
                                Ext.example.msg('Buchung', 'Keine Berechtigung für Buchung!');
                            }
                        }
                    });
                }
            }]
        });

        var distancer = {
            xtype:'panel',
            bodyStyle:'background:#99BBE8;',
            border:false,
            frame:false,
            width:1
        };

        //COMBINATIONS
        var kundenCombination = new Ext.Panel({
            title:'Kunde',
            id:'panelKundeUebernehmen',
            bodyStyle:'background:#D2E1F4;',
            border:false,
            layout:'hbox',
            layoutConfig:{align:'stretch'},
            items:[kundenForm,distancer, SuggestionGrid]
        });

        var AnsprechpersonenCombination = new Ext.Panel({
            title:'Ansprechperson1',
            border:false,
            bodyStyle:'background:#D2E1F4;',
            layout: 'hbox',
            layoutConfig:{align:'stretch'},
            disabled: true,
            items:[AnsprechpersonenForm,distancer, AnsprechpersonenGrid]
        });

        var Ansprechpersonen2Combination = new Ext.Panel({
            title:'Ansprechperson2',
            id:'Ansprechpersonen2Combination',
            border:false,
            bodyStyle:'background:#D2E1F4;',
            layout: 'hbox',
            layoutConfig:{align:'stretch'},
            disabled: true,
            items:[Ansprechpersonen2Form,distancer, Ansprechpersonen2Grid]
        });



        //TABPANEL
        var UebernehmenTabpanel = new Ext.TabPanel({
            activeTab: 0,
            border:false,
            items:[kundenCombination, AnsprechpersonenCombination, Ansprechpersonen2Combination, BuchungsForm]
        });

        Ext.apply(this, {
            title:'Kunde / Ansprechperson / Buchung übernehmen',
            id:'WindowTakeOver',
            closable:true,
            width:750,
            layout:'fit',
            height: 430,
            frame:true,
            resizable:false,
            modal:true,
            items:[UebernehmenTabpanel]
        });
        Ext.ux.WindowTakeOver.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.WindowTakeOver.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
    }
});
 
//register xtype
Ext.reg('windowtakeover', Ext.ux.WindowTakeOver);