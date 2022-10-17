ControllerAnfrageFormPanel = function()
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
        Ext.getCmp('formarea').setHeight(230);
        
        
        //STORES FÜR COMBOBOXEN:
        var auftragsvorlagenstore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'angebotsname'}],
            url:'index.php',
            id:'auftragsvorlagenstore',
            totalProperty:'total',
            baseParams: {cmd:'AngebotsvorlagenGetList'},
            root:'results'
        });
        auftragsvorlagenstore.load({params:{start:0, limit: Application.PageSize}});

        var formatTurnus = function(v, rec) {
            
            var myDate = new Date(v.split("-")[0],v.split("-")[1]-1,v.split("-")[2]);
            //return myDate.format('d.m.Y') + " / " + rec.turnus_dauer + " Tage";
            return Ext.util.Format.date(myDate, 'd.m.Y') + " / " + rec.turnus_dauer + " Tage";
        }

        var turnusstore = new Ext.data.JsonStore({
            fields: [{name:'id'},{name:'turnus_start', convert: formatTurnus}, {name:'turnus_dauer'}],
            url:'index.php',
            id:'turnusstore',
            totalProperty:'total',
            baseParams: {cmd:'TurnusseGetList'},
            root:'results'
        });
        turnusstore.load({params:{start:0, limit: Application.PageSize}});
        
        var turnuslookup = new Ext.data.JsonStore({
            fields:['id','datum','dauer'],
            url:'index.php',
            storeId:'turnuslookup',
            totalProperty:'total',
            baseParams: {cmd:'TurnusseGetLookup'},
            root:'results',
            autoLoad:true
        });

        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            title:'Anfrage-Daten',
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
                name:'id_anfrage',
                id: 'anfrage_id',
                readOnly:true,
                fieldLabel:'Anfragen-Nummer'
            },{
                xtype:'combo',
                editable: false,
                allowBlank:false,
                pageSize: Application.PageSize,
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
                xtype: 'xdatefield',
                name: 'eingegangen_am',
                format:'d.m.Y',
                allowBlank:false,
                fieldLabel: 'Eingangsdatum*'
            },{
                xtype:'combo',
                editable: false,
                allowBlank:false,
                pageSize: Application.PageSize,
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
                pageSize: Application.PageSize,
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
            },{
                xtype:'checkbox',
                name:'agb_check',
                fieldLabel:"AGB's angekreuzt"
            }]
        });
        
        this.tmpComponent.findById('rightfield').add({
            xtype:'fieldset',
            title:'Teilnehmer',
            labelWidth:150,
            defaults:{
                xtype:'numberfield',
                msgTarget: 'side',
                anchor:'90%',
                style:'text-align:right;',
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
                name:'anzahl_weiblich',
                allowBlank:false,
                fieldLabel:'Anzahl weiblich*'
            },{
                name:'anzahl_maennlich',
                allowBlank:false,
                fieldLabel:'Anzahl männlich*'
            },{
                name:'anzahl_begleit_weiblich',
                //allowBlank:false,
                fieldLabel:'Anzahl Begleiter weiblich*'
            },{
                name:'anzahl_begleit_maennlich',
                //allowBlank:false,
                fieldLabel:'Anzahl Begleiter männlich*'
            },{
                name:'anzahl_vegetarier',
                //allowBlank:false,
                fieldLabel:'Anzahl Vegetarier*'
            },{
                name:'anzahl_muslime',
                //allowBlank:false,
                fieldLabel:'Anzahl Muslime*'
            }]
        });

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'fieldset',
            title:'Schule',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:transparent; padding-left:5px;',
            border:false,
            labelWidth:170,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'70%',
                disabled:true,
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
                allowBlank:true,
                fieldLabel:'Straße Schule*'
            },{
                name:'plz_schule',
                id:'plz_schule',
                maxLength:6,
                allowBlank:true,
                fieldLabel:'PLZ Schule*'
            },{
                name:'ort_schule',
                maxLength:45,
                allowBlank:true,
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
                maxLength:70,
                vtype:'email',
                fieldLabel:'e-Mail Schule'
            }]
        },{
            xtype:'fieldset',
            title:'Begleitperson 1',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:transparent; padding-left:5px;',
            border:false,
            labelWidth:170,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'70%',
                disabled:true,
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.'
            },
            items:[{
                name:'vorname_begleitperson1',
                id:'vorname_begleitperson1',
                maxLength:45,
                allowBlank:true,
                fieldLabel:'Vorname*'
            },{
                name:'nachname_begleitperson1',
                id:'nachname_begleitperson1',
                maxLength:45,
                allowBlank:true,
                fieldLabel:'Nachname*'
            },{
                name:'tel_begleitperson1',
                id:'tel_begleitperson1',
                maxLength:45,
                allowBlank:true,
                fieldLabel:'Telefonnr*'
            },{
                name:'mobil_begleitperson1',
                id:'mobil_begleitperson1',
                maxLength:45,
                fieldLabel:'Handy'
            },{
                name:'email_begleitperson1',
                id:'email_begleitperson1',
                maxLength:45,
                allowBlank:true,
                vtype:'email',
                fieldLabel:'e-Mail*'
            },{
                name:'strasse_begleitperson1',
                id:'strasse_begleitperson1',
                maxLength:45,
                allowBlank:true,
                fieldLabel:'Straße*'
            },{
                name:'plz_begleitperson1',
                id:'plz_begleitperson1',
                maxLength:6,
                allowBlank:true,
                fieldLabel:'PLZ*'
            },{
                name:'ort_begleitperson1',
                id:'ort_begleitperson1',
                maxLength:45,
                allowBlank:true,
                fieldLabel:'Ort*'
            }]
        },{
            xtype:'fieldset',
            title:'Begleitpseron 2',
            autoScroll:true,
            labelWidth:170,
            headerAsText:false,
            bodyStyle:'background:transparent; padding-left:5px;',
            border:false,
            defaults:{xtype:'textfield', anchor:'70%', msgTarget: 'side', disabled:true},
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
                maxLength:70,
                vtype:'email',
                fieldLabel:'e-Mail'
            }]
        },{
            xtype:'fieldset',
            title:'Anmerkung',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:transparent; padding-left:5px;',
            border:false,
            labelWidth:170,
            items:[{
                xtype:'textarea',
                maxLength:600,
                msgTarget: 'side',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                name:'anmerkung',
                disabled: true,
                anchor:'95%, 45%',
                fieldLabel:'Anmerkung'
            },{
                xtype:'textarea',
                maxLength:600,
                msgTarget: 'side',
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                name:'allergien',
                disabled: true,
                anchor:'95%, 45%',
                fieldLabel:'Allergien'
            }]
        },{
            xtype:'fieldset',
            title:'Sonstiges',
            autoScroll:true,
            headerAsText:false,
            bodyStyle:'background:transparent; padding-left:5px;',
            border:false,
            labelWidth:170,
            defaults:{xtype:'textfield',anchor:'70%', msgTarget:'side', disabled:true},
            items:[{
                name:'ip_adresse',
                readOnly:true,
                fieldLabel:'IP-Adresse Absender'
            },{
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
        tabarea.setActiveTab(0);
        this.registerInForm();


        //Toolbar-Buttons für das Formular anpassen
        Ext.getCmp('formToolbar').add({
            tooltip:'Anfrage bestätigen, archivieren und als neue Buchung übernehmen',
            iconCls:'grant',
            disabled:true,
            id:'btn_buchung',
            handler: function() {
                var rec = Ext.getCmp('anfragenauswahl').getSelectionModel().getSelected();
                if(rec)
                {
                    var takeOverWindow = new Ext.ux.WindowTakeOver({
                       Controller: new Application.ControllerWindowTakeOver(rec)
                    });
//                    Ext.getCmp('uebernehmenFormKunde').getForm().load({
//                        url: 'index.php',
//                        params: {
//                            cmd: 'AnfrageLoad',
//                            id_anfrage:rec.data.id
//                        },
//                        failure: function(form, action) {
//                            Ext.Msg.alert("Fehler beim Laden der Anfrage.", action.result.errorMessage);
//                        }
//                    });
                    takeOverWindow.show(this);
                } else {Ext.example.msg('Fehler', 'Bitte wählen Sie einen Datensatz aus!');}
            }
        },'->',{
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
                    Ext.example.msg('Erfolg', 'Anfrage gespeichert.');
                    Ext.getCmp('anfragenauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'AnfrageSave'}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_anfrage_load = Ext.getCmp('anfrage_id').getValue();
            if(id_anfrage_load != '0')
            {
                controller.tmpComponent.getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Anfrage wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                                    waitMsg:'Laden...',
                                    waitTitle:'Anfrage laden',
                    params: {cmd: 'AnfrageLoad', id_anfrage: id_anfrage_load}
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