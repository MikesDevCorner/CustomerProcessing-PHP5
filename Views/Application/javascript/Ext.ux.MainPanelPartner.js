Ext.ux.MainPanelPartner = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelPartner.superclass.constructor.apply(this,new Array(configuration));
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
                width:375,
                border:false,
                bodyStyle: 'background-color:transparent',
                split: true, 
                items:[{
                    xtype:'subgridauswahlmodel',
                    region:'center',
                    id:'partnerauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'PartnerGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id'},
                            {name:'firmenname'},
                            {name:'nachname'},
                            {name:'plz'},
                            {name:'ort'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                            {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Nr', dataIndex:'id',width:40, fixed:true, renderer:Application.deactivedRenderer},
                            {header:'Firmenname', dataIndex:'firmenname', width: 135, renderer:Application.deactivedRenderer},
                            {header:'Name', dataIndex:'nachname', width: 135, renderer:Application.deactivedRenderer},
                            {header:'Plz', dataIndex:'plz', width: 40, renderer:Application.deactivedRenderer},
                            {header:'Ort', dataIndex:'ort', width: 135, renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerPartnerGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    region:'south',
                    height:400,
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerPartnerPanelSuche()
                }]
            },{
                xtype:'subformpanelmodel',
                id:'partnerForm',
                //region:'center',
                Controller: new Application.ControllerPartnerFormPanel()
            }]
        });
		
	//Setzen der globalen Variablen auf den Initialwert f�r diese Komponente
	   Application.UseFilter = false;
	   Application.SaveButtonState = false;
	   
	   //Aufruf des Parent-Inits
       Ext.ux.MainPanelPartner.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelPartner.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelpartner', Ext.ux.MainPanelPartner);