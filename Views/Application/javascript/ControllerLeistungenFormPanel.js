Application.ControllerLeistungenFormPanel = function()
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
        //STORES FÜR COMBOBOXEN:
        var partnerleistungenstore = new Ext.data.JsonStore({
            fields: [{name:'id_partner'},{name:'partner'}],
            url:'index.php',
            id:'partnerleistungenstore',
            storeId:'partnerleistungenstore',
            totalProperty:'total',
            baseParams: {cmd:'PartnerLeistungenGetList'},
            root:'results'
        });
        partnerleistungenstore.load({params:{start:0, limit: Application.PageSize}});

        //Setzen der Höhe des oberen Formularbereiches (mit Leftfield und Rightfield als Inhalt)
        Ext.getCmp('tabarea').hide();
        Ext.getCmp('formarea').flex=1;

       //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            autoHeight:true,
            title:'Leistungs-Daten',
            labelWidth:200,
            defaults:{
                xtype:'textfield',
                msgTarget: 'side',
                anchor:'95%',
                disabled:true,
                maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}.',
                blankText:'Dieses Feld ist ein Pflichtfeld.',
                invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}"
            },
            items:[{
                name:'id_leistungen',
                id: 'id_leistungen',
                //style:'text-align:right;',
                readOnly:true,
                fieldLabel:'Leistungs ID'
            },{
                name:'leistungsname',
                id: 'leistungsname',
                allowBlank:false,
                fieldLabel:'Leistungs Name'
            },{
                xtype:'combo',
                typeAhead: false,
                hideTrigger:true,
                forceSelection:true,
                listConfig: {
                    loadingText: 'Suche...',
                    emptyText: 'Keine Partner gefunden'
                },
                pageSize: Application.PageSize,
                id:'cmbPartnerLeistungen',
                store: partnerleistungenstore,
                valueField: 'id_partner',
                displayField: 'partner',
                minChars:2,
                name: 'id_partner',
                submitValue:false,
                fieldLabel: 'Partner* (min. 2 Zeichen eingeben)'
            },{
                name:'standard_uhrzeit',
                id: 'standard_uhrzeit',
                allowBlank:false,
                fieldLabel:'Uhrzeit'
            }/*,{
                name:'preis',
                id: 'preis',
                allowBlank:true,
                fieldLabel:'Preis'
            }*/]
        });

      this.tmpComponent.findById('rightfield').add({
        xtype:'fieldset',
        title:'Weitere Infos',
        labelWidth:100,
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
                    Ext.example.msg('Erfolg', 'Leistung gespeichert.');
                    Ext.getCmp('leistungenauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'LeistungenSave',id_partner: Ext.getCmp('cmbPartnerLeistungen').getValue()}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_leistungen_load = Ext.getCmp('id_leistungen').getValue();
            if(id_leistungen_load != '0')
            {
                controller.tmpComponent.getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Leistung wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                                    waitMsg:'Laden...',
                                    waitTitle:'Leistungen laden',
                    params: {cmd: 'LeistungenLoad', id_leistungen: id_leistungen_load}
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
            //Ext.example.msg('Status', 'Leistungen ausdrucken');
            //Ext.ux.Printer.print(controller.GetComponent().findParentByType('formpanelmodel'));
            window.print();
        });        
        
    }
}