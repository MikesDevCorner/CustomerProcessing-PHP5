Application.ControllerTurnusseFormPanel = function()
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
        Ext.getCmp('tabarea').hide();
        Ext.getCmp('formarea').flex=1;


        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            autoHeight:true,
            title:'Turnus-Daten',
            labelWidth:140,
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
                name:'id_turnus',
                id: 'id_turnus',
                //style:'text-align:right;',
                readOnly:true,
                fieldLabel:'Turnus ID'
            },{
                xtype: 'textfield',
                name: 'turnus_name',
                allowBlank:true,
                fieldLabel: 'Turnus:*'
            },{
                xtype: 'xdatefield',
                name: 'turnus_start',
                format:'d.m.Y',
                allowBlank:false,
                fieldLabel: 'Turnus Start Datum:*'
            },{
                name:'turnus_dauer',
                id: 'turnus_dauer',
                allowBlank:false,
                fieldLabel:'Dauer'
            }]
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
                    Ext.example.msg('Erfolg', 'Turnus gespeichert.');
                    Ext.getCmp('turnusauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'TurnusseSave'}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_turnus_load = Ext.getCmp('id_turnus').getValue();
            if(id_turnus_load != '0')
            {
                controller.tmpComponent.getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Turnus wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                                    waitMsg:'Laden...',
                                    waitTitle:'Turnus laden',
                    params: {cmd: 'TurnusseLoad', id_turnus: id_turnus_load}
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
            //Ext.example.msg('Status', 'Turnus ausdrucken');
            //Ext.ux.Printer.print(controller.GetComponent().findParentByType('formpanelmodel'));
            window.print();
        });        
        
    }
}