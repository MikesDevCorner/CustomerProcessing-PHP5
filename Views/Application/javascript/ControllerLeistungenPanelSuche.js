Application.ControllerLeistungenPanelSuche = function()
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
        this.GetComponent().add({
            xtype:'textfield',
            name:'searchleistungsname',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Leistungsname'
        },{
            xtype:'textfield',
            name:'searchpartner',
            anchor:'95%',
            maxLength:45,
            maxLengthText:'Die maximale Eingabelänge für dieses Feld ist {0}',
            msgTarget: 'side',
            fieldLabel:'Partner'
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
            Ext.getCmp('leistungenauswahl').getStore().reload();
        });

        Ext.getCmp('btn_suchkriterien_go').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b><span style='color:#00aa00;font-weight:bolder;'>&nbsp;&nbsp;(angewendet)</span>");
            Application.UseFilter = true;
            
            var lastOptions = Ext.getCmp('leistungenauswahl').getStore().lastOptions;
            Ext.apply(lastOptions.params, {
                start: 0
            });
            Ext.getCmp('leistungenauswahl').getStore().reload(lastOptions);
        });
    }
}