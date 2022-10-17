Ext.ux.MainPanelAnfragen = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelAnfragen.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            frame:false,
            border:false,
            bodyStyle:'background-color:transparent',
            layout:'border',
            items:[{
                xtype:'panel',
                layout:'border',
                region:'west',
                animCollapse:false,
                collapseMode:'mini',
                width:425,
                border:false,
                bodyStyle:'background-color:transparent',
                split: true,
                items:[{
                    xtype:'subgridauswahlmodel',
                    id:'anfragenauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        baseParams: {cmd:'AnfragenGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id', type:'int'},
                            {name:'angebot'},
                            {name:'schule'},
                            {name:'termin', type:'date', dateFormat:'Y-m-d'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                        {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Nr', dataIndex:'id', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Angebot', dataIndex:'angebot', hidden:true, renderer:Application.deactivedRenderer},
                        {header:'Schule', dataIndex:'schule', width: 135, renderer:Application.deactivedRenderer},
                        {header:'Termin', dataIndex:'termin', width: 85, renderer:Application.deactivedDateRenderer}
                    ],
                    Controller: new ControllerAnfrageGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new ControllerAnfragePanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'anfrageForm',
                Controller: new ControllerAnfrageFormPanel()
            }]
        });

        //Setzen der globalen Variablen auf den Initialwert für diese Komponente
        Application.UseFilter = false;
        Application.SaveButtonState = false;

        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelAnfragen.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelAnfragen.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelanfragen', Ext.ux.MainPanelAnfragen);