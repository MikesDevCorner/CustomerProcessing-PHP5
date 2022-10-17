Ext.ux.MainPanelAngebotsvorlagen = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelAngebotsvorlagen.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'angebotsvorlagenauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        baseParams: {cmd:'AngebotsvorlagenGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'angebotsname'},
                            {name:'aktiv', type:'bool'}                            
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Angebot', dataIndex:'angebotsname', width: 40, renderer:Application.deactivedRenderer}
                            
                    ],
                    Controller: new Application.ControllerAngebotsvorlagenGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                   Controller: new Application.ControllerAngebotsvorlagenPanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'angebotsvorlagenForm',
                //region:'center',
               Controller: new Application.ControllerAngebotsvorlagenFormPanel()
            }]
        });
		
        //Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
        Application.UseFilter = false;
        Application.SaveButtonState = false;
	   
	//Aufruf des Parent-Inits
        Ext.ux.MainPanelAngebotsvorlagen.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelAngebotsvorlagen.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelangebotsvorlagen', Ext.ux.MainPanelAngebotsvorlagen);