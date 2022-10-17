Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = 'Resources/ext3/resources/images/default/s.gif';    
		
    //STORES FÜR COMBOBOXEN:
    var auftragsvorlagenstore = new Ext.data.JsonStore({
        fields: [{name:'id'},{name:'angebotsname'}],
        url:'index.php',
        id:'auftragsvorlagenstore',
        totalProperty:'total',
        baseParams: {cmd:'AngebotsvorlagenGetList'},
        root:'results'
    });
    auftragsvorlagenstore.load({params:{start:0, limit: 15}});
    
    var regionenstore = new Ext.data.JsonStore({
        fields: [{name:'id'},{name:'region'}],
        url:'index.php',
        id:'regionenstore',
        totalProperty:'total',
        baseParams: {cmd:'RegionGetList'},
        root:'results'
    });
    regionenstore.load({params:{start:0, limit: 15}});

    var formatTurnus = function(v, rec) {
        var myDate = new Date(v);
        return myDate.format('d.m.Y') + " / " + rec.turnus_dauer + " Tage";
    }

    var turnusstore = new Ext.data.JsonStore({
        fields: [{name:'id'},{name:'turnus_start', convert: formatTurnus}, {name:'turnus_dauer'}],
        url:'index.php',
        id:'turnusstore',
        totalProperty:'total',
        baseParams: {cmd:'TurnusseGetList'},
        root:'results'
    });
    turnusstore.load({params:{start:0, limit: 15}}); 
    var myDate = new Date();

    //Der Mainbereich f�r den Hauptinhalt:
    var container = new Ext.form.FormPanel({
        id:'_container',
        bodyStyle:'padding:4px;background:transparent;',
        frame:false,
        border:false,
        monitorValid:true,
        scope:this,
        buttons:[{
            text:'Zurücksetzen',
            width:150,
            iconCls:'deny',
            handler: function(btn){
                Ext.getCmp('_container').getForm().reset();
                Ext.getCmp('sonstiges').hide();
                Ext.getCmp('begleiter2').hide();
                Ext.getCmp('begleiter1').hide();
                Ext.getCmp('schule').hide();
                Ext.getCmp('anfragedaten').hide();
            }
        },{
            text:'Absenden',
            width:150,
            iconCls:'save',
            formBind: true,
            handler: function(btn){
                Ext.getCmp('_container').getForm().submit({
                   url:'index.php',
                   params: {
                       cmd:'AnfrageSave',
                       eingegangen_am:myDate.format("Y.m.d"),
                       id_anfrage:0
                   },
                   success: function() {
                        Ext.Msg.alert("Gesendet","Ihre Anfrage wurde an uns übermittelt.");
                        Ext.getCmp('_container').getForm().reset();
                        Ext.getCmp('sonstiges').hide();
                        Ext.getCmp('begleiter2').hide();
                        Ext.getCmp('begleiter1').hide();
                        Ext.getCmp('schule').hide();
                        Ext.getCmp('anfragedaten').hide();
                   }
                });
            }                
        }],
        layout:'anchor',
        items:[{
            xtype:'fieldset',
            bodyStyle:'padding:13px;',
            anchor:'100%',
            buttons:[{text:'Teilnehmer anzeigen',width:150,handler: function() {
                Ext.getCmp('anfragedaten').show();
            }}],
            labelWidth:200,
            title:'Anfrage-Daten',
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'98%', 
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}"
            },
            items:[{
                xtype:'combo',
                editable: false,
                allowBlank:false,
                pageSize: 15,
                triggerAction: 'all',
                id:'cmbRegionen',
                listeners:{
                    select:function(cmb,rec,index) {
                        auftragsvorlagenstore.load({params:{start:0, limit: 15, usefilter:true,searchregion:rec.data.id}});
                    }
                },
                mode:'local',
                store: regionenstore,
                valueField: 'id',
                displayField: 'region',
                name: 'regionsname',
                fieldLabel: 'Region'
            },{
                xtype:'combo',
                editable: false,
                allowBlank:false,
                pageSize: 15,
                triggerAction: 'all',
                id:'cmbAngebotsvorlagen',
                mode:'local',
                store: auftragsvorlagenstore,
                valueField: 'id',
                displayField: 'angebotsname',
                name: 'angebotsname',
                hiddenName:'id_angebotsvorlage',
                submitValue:false,
                fieldLabel: 'Angebotsvorlage*'
            },{
                xtype:'xdatefield',
                format:'d.m.Y',
                id:'searchturnusvon',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                listeners:{
                    change:function(el,newV,oldVal) {
                        turnusstore.load({params:{start:0, limit: 15, usefilter:true,searchturnusvon:newV, searchturnusbis:Ext.getCmp('searchturnusbis').getValue()}});
                    }
                },
                msgTarget: 'side',
                fieldLabel:'Turnusse anzeigen von'
            },{
                xtype:'xdatefield',
                format:'d.m.Y',
                id:'searchturnusbis',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                listeners:{
                    change:function(el,newV,oldVal) {
                        turnusstore.load({params:{start:0, limit: 15, usefilter:true,searchturnusvon:Ext.getCmp('searchturnusvon').getValue(), searchturnusbis:newV}});
                    }
                },
                msgTarget: 'side',
                fieldLabel:'Turnusse anzeigen bis'
            },{
                xtype:'combo',
                editable: false,
                allowBlank:false,
                pageSize: 15,
                triggerAction: 'all',
                id:'cmbTurnus',
                mode:'local',
                store: turnusstore,
                valueField: 'id',
                displayField: 'turnus_start',
                name: 'datum_turnus',
                hiddenName:'id_turnus',
                submitValue:false,
                fieldLabel: 'Turnus*'
            },{
                xtype:'combo',
                editable: false,
                pageSize: 15,
                triggerAction: 'all',
                id:'cmbErsatzTurnus',
                mode:'local',
                store: turnusstore,
                valueField: 'id',
                displayField: 'turnus_start',
                name: 'datum_ersatzturnus',
                hiddenName:'id_ersatzturnus',
                submitValue:false,
                fieldLabel: 'Ersatzturnus'
            }]
        },{xtype:'container',height:20},{
            xtype:'fieldset',
            title:'Teilnehmer',
            hidden:true,
            id:'anfragedaten',
            buttons:[{text:'Schule anzeigen',width:150,handler: function() {
                Ext.getCmp('schule').show();
            }}],
            bodyStyle:'padding:13px;',
            anchor:'100%',
            labelWidth:200,
            defaults:{
                xtype:'numberfield',
                msgTarget: 'side',
                anchor:'98%', 
                minValue:0,
                minText:'Bitte geben Sie einen Wert größer als {0} an.',
                maxValue:32767,
                maxText:'Der größtmögliche Wert für dieses Feld ist {0}',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                decimalPrecision:0
            },
            items:[{
                name:'anzahl_weiblich',
                allowBlank:false,
                fieldLabel:'Anzahl weiblich*'
            },{
                name:'anzahl_maennlich',
                allowBlank:false,
                fieldLabel:'Anzahl männlich*'
            },{
                name:'anzahl_begleit_weiblich',
                allowBlank:false,
                fieldLabel:'Anzahl Begleiter weiblich*'
            },{
                name:'anzahl_begleit_maennlich',
                allowBlank:false,
                fieldLabel:'Anzahl Begleiter männlich*'
            },{
                name:'anzahl_vegetarier',
                allowBlank:false,
                fieldLabel:'Anzahl Vegetarier*'
            },{
                name:'anzahl_muslime',
                allowBlank:false,
                fieldLabel:'Anzahl Muslime*'
            }]
        },{xtype:'container',height:20},{
            xtype:'fieldset',
            title:'Schule',
            buttons:[{text:'Begleitperson1 anzeigen',width:150,handler: function() {
                Ext.getCmp('begleiter1').show();
            }}],
            hidden:true,
            id:'schule',
            bodyStyle:'padding:13px;',
            anchor:'100%',
            labelWidth:200,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'98%',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.'
            },
            items:[{
                name:'name_schule',
                id:'name_schule',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Name der Schule*'
            },{
                name:'name_klasse',
                maxLength:45,
                fieldLabel:'Klasse'
            },{
                name:'strasse_schule',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Straße Schule*'
            },{
                name:'plz_schule',
                id:'plz_schule',
                maxLength:6,
                allowBlank:false,
                fieldLabel:'PLZ Schule*'
            },{
                name:'ort_schule',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Ort Schule*'
            },{
                name:'telefon_schule',
                maxLength:45,
                fieldLabel:'Telefonnummer Schule'
            },{

                name:'fax_schule',
                maxLength:45,
                fieldLabel:'Faxnummer Schule'
            },{
                name:'email_schule',
                maxLength:45,
                vtype:'email',
                fieldLabel:'e-Mail Schule'
            }]
        },{xtype:'container',height:20},{
            xtype:'fieldset',
            hidden:true,
            id:'begleiter1',
            buttons:[{text:'Begleitperson2 anzeigen',width:150,handler: function() {
                Ext.getCmp('begleiter2').show();
            }}],
            title:'Begleitperson 1',
            bodyStyle:'padding:13px;',
            anchor:'100%',
            labelWidth:200,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'98%',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.'
            },
            items:[{
                name:'vorname_begleitperson1',
                id:'vorname_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Vorname*'
            },{
                name:'nachname_begleitperson1',
                id:'nachname_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Nachname*'
            },{
                name:'tel_begleitperson1',
                id:'tel_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Telefonnr*'
            },{
                name:'mobil_begleitperson1',
                id:'mobil_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Handy'
            },{
                name:'email_begleitperson1',
                id:'email_begleitperson1',
                maxLength:45,
                allowBlank:false,
                vtype:'email',
                fieldLabel:'e-Mail*'
            },{
                name:'strasse_begleitperson1',
                id:'strasse_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Straße*'
            },{
                name:'plz_begleitperson1',
                id:'plz_begleitperson1',
                maxLength:6,
                allowBlank:false,
                fieldLabel:'PLZ*'
            },{
                name:'ort_begleitperson1',
                id:'ort_begleitperson1',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Ort*'
            }]
        },{xtype:'container',height:20},{
            xtype:'fieldset',
            title:'Begleitpseron 2',
            buttons:[{text:'Anmerkung anzeigen',width:150,handler: function() {
                Ext.getCmp('sonstiges').show();
            }}],
            hidden:true,
            id:'begleiter2',
            bodyStyle:'padding:13px;',
            anchor:'100%',
            labelWidth:200,
            defaults:{xtype:'textfield', anchor:'98%', msgTarget: 'side'},
            items:[{
                name:'vorname_begleitperson2',
                maxLength:45,
                fieldLabel:'Vorname'
            },{
                name:'nachname_begleitperson2',
                id:'nachname_begleitperson2',
                maxLength:45,
                fieldLabel:'Nachname'
            },{
                name:'tel_begleitperson2',
                maxLength:45,
                fieldLabel:'Telefonnr'
            },{
                name:'mobil_begleitperson2',
                maxLength:45,
                fieldLabel:'Handy'
            },{
                name:'email_begleitperson2',
                maxLength:45,
                vtype:'email',
                fieldLabel:'e-Mail'
            }]
        },{xtype:'container',height:20},{
            xtype:'fieldset',
            title:'Sonstiges',
            hidden:true,
            id:'sonstiges',
            bodyStyle:'padding:13px;',
            anchor:'100%',
            labelWidth:200,
            defaults:{xtype:'textfield',anchor:'98%', msgTarget:'side'},
            items:[{
                xtype:'textarea',
                maxLength:600,
                msgTarget: 'side',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                name:'allergien',
                anchor:'98%, 40',
                fieldLabel:'Allergien'
            },{
                xtype:'textarea',
                maxLength:600,
                msgTarget: 'side',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                name:'anmerkung',
                anchor:'98%, 40',
                fieldLabel:'Anmerkung'
            },{
                xtype:'checkbox',
                name:'agb_check',
                fieldLabel:"Ich akzeptiere die AGB's"
            }]
        }]
    });
    container.render('maincontent');
    
});