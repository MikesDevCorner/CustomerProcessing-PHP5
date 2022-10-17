Ext.ux.MainPanelKunden = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelKunden.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'kundenauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'KundeGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'name_schule'},
                            {name:'plz_schule'},
                            {name:'ort_schule'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                        {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Kunde', dataIndex:'name_schule', width: 100, renderer:Application.deactivedRenderer},
                        {header:'Plz', dataIndex:'plz_schule', width: 60, renderer:Application.deactivedRenderer},
                        {header:'Ort', dataIndex:'ort_schule', width: 90, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerKundenGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    id:'suchpanel',
                    collapseMode:'mini',
                   Controller: new Application.ControllerKundenPanelSuche()
                }]
            },{
                xtype:'subcontainerpanelmodel',
                id:'kundenForm',
                //region:'center',
               Controller: new Application.ControllerKundenContainerPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelKunden.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelKunden.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelkunden', Ext.ux.MainPanelKunden);