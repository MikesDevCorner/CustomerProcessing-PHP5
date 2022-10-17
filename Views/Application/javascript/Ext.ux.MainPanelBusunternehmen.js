Ext.ux.MainPanelBusunternehmen = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelBusunternehmen.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'busunternehmenauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        autoLoad:false,
                        totalProperty:'total',
                        baseParams: {cmd:'BusunternehmenGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'busunternehmen'},
                            {name:'plz'},
                            {name:'ort'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Busunternehmen', dataIndex:'busunternehmen', width: 100, renderer:Application.deactivedRenderer},
                            {header:'Plz', dataIndex:'plz', width: 40, renderer:Application.deactivedRenderer},
                            {header:'Ort', dataIndex:'ort', width: 100, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerBusunternehmenGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerBusunternehmenPanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'busunternehmenForm',
                //region:'center',
                Controller: new Application.ControllerBusunternehmenFormPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelBusunternehmen.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelBusunternehmen.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelbusunternehmen', Ext.ux.MainPanelBusunternehmen);