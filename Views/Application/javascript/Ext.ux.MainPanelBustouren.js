Ext.ux.MainPanelBustouren = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelBustouren.superclass.constructor.apply(this,new Array(configuration));
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
                width:475,
                border:false,
                bodyStyle:'background-color:transparent',
                split: true,
                items:[{
                    xtype:'subgridauswahlmodel',
                    id:'bustourauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        autoLoad:false,
                        totalProperty:'total',
                        baseParams: {cmd:'BusausschreibungGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id', type:'int'},
                            {name:'datum', type:'date', dateFormat:'Y-m-d'},
                            {name:'anz_buchungen', type:'int'},
                            {name:'anz_persons', type:'int'},
                            {name:'kurztext'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                        {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Nr', dataIndex:'id', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Datum', dataIndex:'datum', width: 65, renderer:Application.deactivedDateRenderer},
                        {header:'Kurztext', dataIndex:'kurztext',hidden:true, renderer:Application.deactivedRenderer},
                        {header:'Buchungen', dataIndex:'anz_buchungen', renderer: Application.deactivedRenderer},
                        {header:'Personen', dataIndex:'anz_persons', renderer: Application.deactivedRenderer}
                    ],
                    Controller: new ControllerBustourGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new ControllerBustourPanelSuche()
                }]
            },{
                xtype:'subcontainerpanelmodel',
                id:'bustourForm',
                Controller: new ControllerBustourContainerPanel()
            }]
        });
        
        //Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
        Application.UseFilter = false;
        Application.SaveButtonState = false;
        
        Ext.ux.MainPanelBustouren.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelBustouren.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelbustouren', Ext.ux.MainPanelBustouren);