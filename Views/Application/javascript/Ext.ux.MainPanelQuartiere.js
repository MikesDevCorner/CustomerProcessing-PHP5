Ext.ux.MainPanelQuartiere = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelQuartiere.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'quartiereauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'QuartiereGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'quartier_name'},
                            {name:'quartier_plz'},
                            {name:'quartier_ort'},
                            {name:'aktiv', type:'bool'}                            
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Quartier', dataIndex:'quartier_name', width: 40, renderer:Application.deactivedRenderer},
                            {header:'PLZ', dataIndex:'quartier_plz', width: 40, renderer:Application.deactivedRenderer},
                            {header:'Ort', dataIndex:'quartier_ort', width: 40, renderer:Application.deactivedRenderer}
                            
                    ],
                    Controller: new Application.ControllerQuartiereGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                   Controller: new Application.ControllerQuartierePanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'quartiereForm',
                //region:'center',
               Controller: new Application.ControllerQuartiereFormPanel()
            }]
        });
		
        //Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
        Application.UseFilter = false;
        Application.SaveButtonState = false;
	   
	//Aufruf des Parent-Inits
        Ext.ux.MainPanelQuartiere.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelQuartiere.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelqaurtiere', Ext.ux.MainPanelQuartiere);