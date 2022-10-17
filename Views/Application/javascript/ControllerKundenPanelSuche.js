Application.ControllerKundenPanelSuche = function()
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
        this.GetComponent().setHeight(160);
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
            fieldLabel:'Kundennummer'
        },{
            xtype:'textfield',
            name:'searchname',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Name'
        },{
            xtype:'textfield',
            name:'searchplz',
            anchor:'95%',
            maxLength:4,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'PLZ'
        },{
            xtype:'checkbox',
            name:'searcharchiv',
            id:'searcharchiv',
            anchor:'95%',
            msgTarget: 'side',
            fieldLabel:'Archiv durchsuchen'
        });
        
        Application.UseFilter = false;
    }

    this.SetListeners = function()
    {
        Ext.getCmp('btn_suchkriterien_del').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b>");
            Application.UseFilter = false;
            Ext.getCmp('kundenauswahl').getStore().reload();
        });

        Ext.getCmp('btn_suchkriterien_go').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b><span style='color:#00aa00;font-weight:bolder;'>&nbsp;&nbsp;(angewendet)</span>");
            Application.UseFilter = true;
            
            var lastOptions = Ext.getCmp('kundenauswahl').getStore().lastOptions;
            Ext.apply(lastOptions.params, {
                start: 0
            });
            Ext.getCmp('kundenauswahl').getStore().reload(lastOptions);
        });
    }
}