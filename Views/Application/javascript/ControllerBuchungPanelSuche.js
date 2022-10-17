ControllerBuchungPanelSuche = function()
{
    this.tmpComponent;

    this.AssignComponent = function(component)
    {
        this.tmpComponent = component;
    }

    this.GetComponent = function()
    {
        return this.tmpComponent;
    }

    this.Init = function()
    {
        var nowtime = new Date();
        this.GetComponent().setHeight(260);
        this.GetComponent().add({
            xtype:'numberfield',
            anchor:'95%',
            minValue:0,
            msgTarget: 'side',
            minText:'Bitte geben Sie einen Wert größer als {0} an.',
            maxValue:32767,
            maxText:'Der größtmögliche Wert für dieses Feld ist {0}',
            style:'text-align:right;',
            decimalPrecision:0,
            name:'searchid',
            fieldLabel:'Buchungs-Nummer'
        },{
            xtype:'textfield',
            name:'searchkunde',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Schule'
        },{
            name:'searchstatus',
            xtype:'combo',
            anchor:'95%',
            msgTarget: 'side',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                storeId: 'searchstatusstore',
                idIndex: 0,
                fields: ['status'],
                data:[['gebucht'],['bestätigt'],['abgeschlossen']]
            }),
            triggerAction:'all',
            mode:'local',
            lazyRender:true,
            forceSelection:true,
            value:'gebucht',
            valueField:'status',
            displayField:'status',
            fieldLabel:'Status'
        },{
            xtype:'textfield',
            name:'searchklasse',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Klasse'
        },{
            xtype:'xdatefield',
            format:'d.m.Y',
            invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
            anchor:'95%',
            name:'searchterminvon',
            msgTarget: 'side',
            value:new Date(nowtime.getFullYear(),0,1),
            fieldLabel:'Termin von'
        },{
            xtype:'xdatefield',
            format:'d.m.Y',
            invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
            anchor:'95%',
            msgTarget: 'side',
            name:'searchterminbis',
            value:new Date(nowtime.getFullYear(),11,31),
            fieldLabel:'Termin bis'
        },{
            xtype:'textfield',
            name:'searchangebotsvorlage',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Angebot'
        },{
            xtype:'checkbox',
            name:'searcharchiv',
            id:'searcharchiv',
            anchor:'95%',
            msgTarget: 'side',
            fieldLabel:'Archiv durchsuchen'
        });
        
        Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b><span style='color:#00aa00;font-weight:bolder;'>&nbsp;&nbsp;(angewendet)</span>");
        Application.UseFilter = true;
        var buchungsgrid = Ext.getCmp('buchungauswahl');
        buchungsgrid.getStore()._pollEnabled=true;
        Application.pollForChanges(buchungsgrid,true);     
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_suchkriterien_del').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b>");
            Application.UseFilter = false;
            Ext.getCmp('buchungauswahl').getStore().reload();
        });

        Ext.getCmp('btn_suchkriterien_go').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b><span style='color:#00aa00;font-weight:bolder;'>&nbsp;&nbsp;(angewendet)</span>");
            Application.UseFilter = true;
            
            var lastOptions = Ext.getCmp('buchungauswahl').getStore().lastOptions;
            Ext.apply(lastOptions.params, {
                start: 0
            });            
            Ext.getCmp('buchungauswahl').getStore().reload(lastOptions);
        });
    }
}