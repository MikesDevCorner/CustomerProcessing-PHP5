Ext.ux.MainPanelTurnusse = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelTurnusse.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'turnusauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        baseParams: {cmd:'TurnusseGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'turnus_name'},
                            {name:'turnus_start', type:'date', dateFormat:'Y-m-d'},
                            {name:'turnus_dauer'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Tu', dataIndex:'turnus_name',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Startdatum', dataIndex:'turnus_start', width: 85, renderer:Application.deactivedDateRenderer},
                            {header:'Dauer', dataIndex:'turnus_dauer', width: 40, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerTurnusseGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerTurnussePanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'turnusForm',
                //region:'center',
                Controller: new Application.ControllerTurnusseFormPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelTurnusse.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelTurnusse.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelturnusse', Ext.ux.MainPanelTurnusse);