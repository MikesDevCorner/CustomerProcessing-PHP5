Application.ControllerTurnussePanelSuche = function()
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
            xtype:'xdatefield',
            format:'d.m.Y',
            invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
            anchor:'95%',
            name:'searchturnusvon',
            msgTarget: 'side',
            fieldLabel:'Turnus von'
        },{
            xtype:'xdatefield',
            format:'d.m.Y',
            invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
            anchor:'95%',
            name:'searchturnusbis',
            msgTarget: 'side',
            fieldLabel:'Turnus bis'
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
            Ext.getCmp('turnusauswahl').getStore().reload();
        });

        Ext.getCmp('btn_suchkriterien_go').on('click', function() {
            Ext.getCmp('suchtitel').setValue("<b>&nbsp;Suchfilter</b><span style='color:#00aa00;font-weight:bolder;'>&nbsp;&nbsp;(angewendet)</span>");
            Application.UseFilter = true;
            
            var lastOptions = Ext.getCmp('turnusauswahl').getStore().lastOptions;
            Ext.apply(lastOptions.params, {
                start: 0
            }); 
            Ext.getCmp('turnusauswahl').getStore().reload(lastOptions);
        });
    }
}