Ext.ux.MainPanelBuchungen = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelBuchungen.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'buchungauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        pageSize: Application.PageSize,
                        baseParams: {cmd:'BuchungenGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id', type:'int'},
                            {name:'angebotsname'},
                            {name:'name_schule'},
                            {name:'datum', type:'date', dateFormat:'Y-m-d'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                        {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Nr', dataIndex:'id', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Angebot', dataIndex:'angebotsname', hidden:true, renderer:Application.deactivedRenderer},
                        {header:'Schule', dataIndex:'name_schule', width: 135, renderer:Application.deactivedRenderer},
                        {header:'Termin', dataIndex:'datum', width: 85, renderer:Application.deactivedDateRenderer}
                    ],
                    Controller: new ControllerBuchungGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new ControllerBuchungPanelSuche()
                }]
            },{
                xtype:'subcontainerpanelmodel',
                id:'buchungForm',
                Controller: new ControllerBuchungContainerPanel()
            }]
        });
        
        //Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
        Application.UseFilter = true;
        Application.SaveButtonState = false;
        
        Ext.ux.MainPanelBuchungen.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelBuchungen.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelbuchungen', Ext.ux.MainPanelBuchungen);