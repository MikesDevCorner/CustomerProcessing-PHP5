Ext.ux.SubPanelSuche = Ext.extend(Ext.form.FormPanel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.SubPanelSuche.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            region:'south',
            split:'true',
            labelWidth:120,
            collapsible:true,
            animCollapse:false,
            height:185,
            autoScroll:true,
            header:false,
            bodyStyle:'padding:10px;',
            tbar: new Ext.Toolbar({
                items:[{
                        xtype:'displayfield',
                        id:'suchtitel',
                        value:'<b>&nbsp;Suchfilter</b>'
                    },'->',
                    {
                        iconCls:'search',
                        text:'Filter anwenden',
                        id:'btn_suchkriterien_go'
                    },{
                        iconCls:'deny',
                        text:'Filter ausschalten',
                        id:'btn_suchkriterien_del'
                    }
                ]
            }),
            defaults:{anchor:'100%'},
            items:[]
        });
        Ext.ux.SubPanelSuche.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.SubPanelSuche.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
    }
});
 
//register xtype
Ext.reg('subpanelsuche', Ext.ux.SubPanelSuche);