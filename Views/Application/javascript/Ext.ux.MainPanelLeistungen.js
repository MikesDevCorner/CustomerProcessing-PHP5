Ext.ux.MainPanelLeistungen = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelLeistungen.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            frame:false,
            border:false,
            bodyStyle:'background-color:transparent',
            layout:'border',
            items:[{
                xtype:'panel',
                region:'west',
                layout:'border',
                animCollapse:false,
                collapseMode:'mini',
                width:325,
                border:false,
                bodyStyle: 'background-color:transparent',
                split: true, 
                items:[{
                    xtype:'subgridauswahlmodel',
                    region:'center',
                    id:'leistungenauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'LeistungenGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'leistung'},
                            {name:'firmenname'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Leistung', dataIndex:'leistung', width: 135, renderer:Application.deactivedRenderer},
                            {header:'Partner', dataIndex:'firmenname', width: 130, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerLeistungenGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerLeistungenPanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'leistungenForm',
                //region:'center',
                Controller: new Application.ControllerLeistungenFormPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelLeistungen.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelLeistungen.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelleistungen', Ext.ux.MainPanelLeistungen);