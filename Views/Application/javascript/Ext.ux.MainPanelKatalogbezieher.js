Ext.ux.MainPanelKatalogbezieher = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelKatalogbezieher.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'katalogbezieherauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'KatalogbezieherGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'nachname'},
                            {name:'plz'},
                            {name:'ort'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Name', dataIndex:'nachname', width: 135, renderer:Application.deactivedRenderer},
                            {header:'Plz', dataIndex:'plz', width: 40, renderer:Application.deactivedRenderer},
                            {header:'Ort', dataIndex:'ort', width: 135, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerKatalogbezieherGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerKatalogbezieherPanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'katalogbezieherForm',
                //region:'center',
                Controller: new Application.ControllerKatalogbezieherFormPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelKatalogbezieher.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelKatalogbezieher.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelkatalogbezieher', Ext.ux.MainPanelKatalogbezieher);