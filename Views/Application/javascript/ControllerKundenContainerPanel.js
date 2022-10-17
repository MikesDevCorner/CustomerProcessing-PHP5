Application.ControllerKundenContainerPanel = function()
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


    this.enableAllAnsprechChilds = function() {
            var ansprechFieldset = Ext.getCmp('fieldsetAnsprechpersonen');
            //Alle Items des Formualres enablen (da disabled initiiert wurde).
            Ext.each(ansprechFieldset.findByType('textfield'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('displayfield'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('numberfield'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('combo'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('xdatefield'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('textarea'),function(item){
                item.enable();
            });
            Ext.each(ansprechFieldset.findByType('checkbox'),function(item){
                item.enable();
            });
    }

    this.disableAllAnsprechChilds = function() {
            var ansprechFieldset = Ext.getCmp('fieldsetAnsprechpersonen');
            //Alle Items des Formualres enablen (da disabled initiiert wurde).
            Ext.each(ansprechFieldset.findByType('textfield'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('displayfield'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('numberfield'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('combo'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('xdatefield'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('textarea'),function(item){
                item.disable();
            });
            Ext.each(ansprechFieldset.findByType('checkbox'),function(item){
                item.disable();
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
        Ext.getCmp('formarea').setHeight(215);

        //Aufbereiten der Formularinhalte:
        this.tmpComponent.findById('leftfield').add({
            xtype:'fieldset',
            border:false,
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
                xtype:'numberfield',
                name:'id_kunde',
                id: 'id_kunde',
                allowBlank:false,
                readOnly:true,
                fieldLabel:'Kundennummer'
            },{
                name:'name_schule',
                id:'name_schule',
                maxLength:45,
                allowBlank:false,
                fieldLabel:'Name Schule*'
            },{
                name:'strasse_schule',
                maxLength:65,
                allowBlank:true,
                fieldLabel:'Straße'
            },{
                name:'plz_schule',
                maxLength:5,
                allowBlank:true,
                fieldLabel:'PLZ'
            },{
                name:'ort_schule',
                maxLength:50,
                allowBlank:true,
                fieldLabel:'Ort'
            },{
                name:'telefon_schule',
                allowBlank:true,
                fieldLabel:'Telefon'
            }]
        }); 
        
        this.tmpComponent.findById('rightfield').add({
            xtype:'fieldset',
            border:false,
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
                name:'fax_schule',
                maxLength:50,
                fieldLabel:'Fax'
            },{
                name:'email_schule',
                maxLength:45,
                vtype:'email',
                fieldLabel:'Mail'
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
            },{
                name:'bemerkung',
                xtype:'textarea',
                fieldLabel:'Bemerkung'
            }]
        });
        

        var tabarea = this.tmpComponent.findById('tabarea');
        tabarea.add({
            xtype:'panel',
            border:false,
            layout:'hbox',
            bodyStyle:'padding:10px;padding-right:0px;background:#E3ECFA;',
            layoutConfig:{
                align:'stretch',
                defaultMargins:{
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 0
                }
            },
            title:'Ansprechpersonen',
            items:[{
                xtype:'grid',
                id:'ansprechpersonenGrid',
                tbar:['->',{
                    iconCls:'add',
                    tooltip:'Ansprechperson hinzufügen',
                    scope:this,
                    handler: function() {
                        var ansprechpersonenForm = Ext.getCmp('ansprechpersonenForm');
                        var ansprechpersonenGrid = Ext.getCmp('ansprechpersonenGrid');
                        ansprechpersonenGrid.getSelectionModel().clearSelections();
                        this.enableAllAnsprechChilds();
                        Ext.getCmp('saveAnsprechperson').enable();
                        Ext.getCmp('cancelAnsprechperson').enable();
                        ansprechpersonenForm.getForm().reset();
                        Ext.getCmp('ansprechpersonenHeadDisplay').setValue("<b style='color:red;'>NEUE ANSPRECHPERSON, UNGESPEICHERT</b>");
                        Ext.getCmp('id_ansprechperson').setValue('0');
                        Ext.getCmp('ansprechVorname').focus();
                    }
                },{
                    iconCls:'delete',
                    tooltip:'Ansprechperson löschen',
                    scope:this,
                    handler: function() {
                        var ansprechpersonenGrid = Ext.getCmp('ansprechpersonenGrid');
                        if(ansprechpersonenGrid.getSelectionModel().hasSelection())
                        {
                            Ext.Msg.show({
                               title:'Löschen',
                               msg: 'Die Ansprechperson mit der Nr. '+ansprechpersonenGrid.getSelectionModel().getSelected().data.id+', '+ansprechpersonenGrid.getSelectionModel().getSelected().data.nachname+' wird gelöscht.<br/><br/>Soll mit der Aktion fortgefahren werden?',
                               buttons: Ext.Msg.YESNO,
                               fn: function(buttonId) {
                                   if(buttonId == 'yes')
                                   {
                                        Ext.Ajax.request({
                                           url:'index.php',
                                           params:{
                                               cmd:'BegleitpersonDel',
                                               id: ansprechpersonenGrid.getSelectionModel().getSelected().data.id
                                           },
                                           success: function() {
                                               ansprechpersonenGrid.getStore().reload();
                                           },
                                           failure: function() {
                                               Ext.Msg.alert('Fehler','Fehler beim Löschen ist aufgetreten.');
                                           }
                                        });
                                   }
                               },
                               icon: Ext.MessageBox.QUESTION
                            });
                        }
                        else {Ext.example.msg('Hinweis', 'Bitte wählen Sie einen Datensatz zum Löschen aus.');}
                    }
                }],
                flex:1,
                sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
                columns: [
                    {header:'', dataIndex:'icon', width:40, fixed:true},
                    {header:'Vorname',dataIndex:'vorname',width:100},
                    {header:'Nachname',width:100,dataIndex:'nachname'},
                    {header:'PLZ',width:50,dataIndex:'plz'}
                ],
                stripeRows:true,
                scope:this,
                viewConfig: {
                    forceFit:true,
                    columnsText:'Spalten',
                    sortAscText:'aufsteigend sortieren',
                    sortDescText:'absteigend sortieren',
                    emptyText:'Keine Ansprechpersonen verfügbar',
                    headersDisabled:true,
                    scrollOffset:0
                },
                store: new Ext.data.JsonStore({
                    url:'index.php',
                    totalProperty:'total',
                    storeId:'begleitpersonenStore',
                    baseParams: {cmd:'BegleitpersonGetList'},
                    root:'results',
                    fields: [
                        {name:'icon'},
                        {name:'id'},
                        {name:'vorname'},
                        {name:'nachname'},
                        {name:'plz'},
                        {name:'ort'}
                    ]
                }),
                listeners:{
                    rowclick:{
                        scope:this,
                        fn: function(grid,rowIndex) {
                            Ext.getCmp('ansprechpersonenHeadDisplay').setValue("");
                            var ansprechpersonenForm = Ext.getCmp('ansprechpersonenForm');

                            this.enableAllAnsprechChilds();
                            Ext.getCmp('saveAnsprechperson').enable();
                            Ext.getCmp('cancelAnsprechperson').enable();
                            ansprechpersonenForm.getForm().load({
                                url: 'index.php',
                                success: function(response,options) {

                                },
                                failure: function() {
                                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes.');
                                },
                                waitMsg:'Laden...',
                                waitTitle:'Ansprechperson laden',
                                method: 'POST',
                                params: { cmd: 'BegleitpersonLoad', id_begleitperson: grid.getStore().getAt(rowIndex).id }
                            });
                        }
                    }
                }
            },{
                xtype:'form',
                autoScroll:true,
                id:'ansprechpersonenForm',
                frame:false,
                labelWidth:150,
                flex:2,
                bodyStyle:'padding:15px;background:#fff;',
                tbar:[{
                    iconCls:'save',
                    tooltip:'Ansprechperson speichern',
                    disabled:true,
                    id:'saveAnsprechperson',
                    scope:this,
                    handler: function() {
                        Ext.getCmp('ansprechpersonenHeadDisplay').setValue("");
                        Ext.getCmp('ansprechpersonenForm').getForm().submit({
                            url: 'index.php',
                            success: function(response,options) {
                                Ext.example.msg('Erfolg', 'Ansprechperson gespeichert.');
                                Ext.getCmp('ansprechpersonenGrid').getStore().reload();
                            },
                            failure: function(a,b,c) {
                                Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten.');
                            },
                            method: 'POST',
                            params: {cmd: 'BegleitpersonSave', id_kunde: Ext.getCmp('id_kunde').getValue()}
                        });
                    }
                },{
                    iconCls:'deny',
                    tooltip:'Ansprechperson zurücksetzen',
                    disabled:true,
                    id:'cancelAnsprechperson',
                    scope:this,
                    handler: function() {
                        Ext.getCmp('ansprechpersonenHeadDisplay').setValue("");
                        var ansprechpersonenForm = Ext.getCmp('ansprechpersonenForm');

                        var id_ansprechperson_load = Ext.getCmp('id_ansprechperson').getValue();
                        if(id_ansprechperson_load != '0')
                        {
                           ansprechpersonenForm.getForm().load({
                                url: 'index.php',
                                success: function(response,options) {
                                    Ext.example.msg('Status', 'Ansprechperson wurde zurückgesetzt.');
                                },
                                failure: function() {
                                    Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                                },
                                method: 'POST',
                                waitMsg:'Laden...',
                                waitTitle:'Ansprechperson laden',
                                params: {cmd: 'BegleitpersonLoad', id_begleitperson: id_ansprechperson_load}
                            });
                        }
                        else
                        {
                            ansprechpersonenForm.getForm().reset();
                            this.disableAllAnsprechChilds();
                            Ext.getCmp('saveAnsprechperson').disable();
                            Ext.getCmp('cancelAnsprechperson').disable();
                        }
                    }
                },'->',{
                    xtype:'displayfield',
                    id:'ansprechpersonenHeadDisplay',
                    value:''
                }],
                items:[{
                    xtype:'fieldset',
                    border:false,
                    id:'fieldsetAnsprechpersonen',
                    defaults:{
                        anchor:'95%',
                        xtype:'textfield',
                        blankText:'Dieses Feld ist ein Pflichtfeld.',
                        disabled:true
                    },
                    items:[{
                        xtype:'numberfield',
                        name:'id_begleitperson',
                        fieldLabel:'Nr',
                        id: 'id_ansprechperson',
                        allowBlank:false,
                        readOnly:true
                    },{
                        maxLength:50,
                        fieldLabel:'Vorname',
                        id:'ansprechVorname',
                        name:'vorname'
                    },{
                        allowBlank:false,
                        maxLength:50,
                        fieldLabel:'Nachname*',
                        name:'nachname'
                    },{
                        allowBlank:true,
                        maxLength:50,
                        fieldLabel:'Straße',
                        name:'strasse'
                    },{
                        allowBlank:true,
                        maxLength:5,
                        fieldLabel:'PLZ',
                        name:'plz'
                    },{
                        allowBlank:true,
                        maxLength:50,
                        fieldLabel:'Ort',
                        name:'ort'
                    },{
                        allowBlank:true,
                        maxLength:50,
                        fieldLabel:'Telefon',
                        name:'tel'
                    },{
                        maxLength:50,
                        fieldLabel:'Mobil',
                        name:'mobil'
                    },{
                        //allowBlank:false,
                        maxLength:50,
                        fieldLabel:'Mail',
                        vtype:'email',
                        name:'email'
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
                    },{
                        xtype:'textarea',
                        fieldLabel:'Bemerkung',
                        name:'bemerkung'
                    }]
                }]
            }]
        });
        tabarea.setActiveTab(0);
        
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
                    Ext.example.msg('Erfolg', 'Kunde gespeichert.');
                    Ext.getCmp('kundenauswahl').getStore().reload();
                },
                failure: function(a,b,c) {
                    Ext.example.msg('Error', 'Fehler beim Speichern aufgetreten: '+Ext.decode(b.response.responseText).message);
                },
                method: 'POST',
                params: {cmd: 'KundeSave'}
            });
        });

        Ext.getCmp('btn_abbrechen').on('click', function() {
            Ext.getCmp('formheaddisplay').setValue('');
            var id_kunde_load = Ext.getCmp('id_kunde').getValue();
            if(id_kunde_load != '0')
            {
                Ext.getCmp('formarea').getForm().load({
                    url: 'index.php',
                    success: function(response,options) {
                        Ext.example.msg('Status', 'Kunde wurde zurückgesetzt.');
                    },
                    failure: function() {
                        Ext.example.msg('Error', 'Fehler beim Laden des Datensatzes');
                    },
                    method: 'POST',
                    waitMsg:'Laden...',
                    waitTitle:'Kunden laden',
                    params: {cmd: 'KundeLoad', id_kunde: id_kunde_load}
                });
            }
            else
            {
                Ext.getCmp('formarea').getForm().reset();
                controller.disableAllChilds();
                controller.disableAllToolbarButtons();
            }
        });


        Ext.getCmp('formarea').on('clientvalidation',function(form, valid) {
           if(Application.SaveButtonState == true) { savebtn.setDisabled(!valid); }
           else { savebtn.disable(); }
        });

        Ext.getCmp('btn_drucken').on('click', function() {
            //Ext.example.msg('Status', 'Busunternehmen ausdrucken');
            //Ext.ux.Printer.print(controller.GetComponent().findParentByType('formpanelmodel'));
            window.print();
        });        
        
    }
}