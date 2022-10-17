Ext.ux.MainPanelUser = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelUser.superclass.constructor.apply(this,new Array(configuration));
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
                width:375,
                border:false,
                bodyStyle:'background-color:transparent',
                split: true,
                items:[{
                    xtype:'subgridauswahlmodel',
                    id:'userauswahl',
                    store:new Ext.data.JsonStore({
                        url:'index.php',
                        totalProperty:'total',
                        autoLoad:false,
                        baseParams: {cmd:'UserGetList'},
                        root:'results',
                        fields: [
                            {name:'icon'},
                            {name:'id', type:'int'},
                            {name:'username'},
                            {name:'vorname'},
                            {name:'nachname'},
                            {name:'aktiv', type:'bool'}
                        ]
                    }),
                    columns: [
                        {header:'', dataIndex:'icon', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Nr', dataIndex:'id', width:40, fixed:true, renderer:Application.deactivedRenderer},
                        {header:'Username', dataIndex:'username', renderer:Application.deactivedRenderer},
                        {header:'vorname', dataIndex:'vorname', hidden:true, renderer:Application.deactivedRenderer},
                        {header:'nachname', dataIndex:'nachname', renderer:Application.deactivedRenderer}
                    ],
                    Controller: new Application.ControllerUserGridAuswahl()
                },{
                    xtype:'subpanelsuche',
                    id:'suchpanel',
                    collapseMode:'mini',
                    Controller: new Application.ControllerUserPanelSuche()
                }]
            },{
                xtype:'subformpanelmodelsimple',
                id:'userForm',
                Controller: new Application.ControllerUserFormPanel()
            }]
        });

        //Setzen der globalen Variablen auf den Initialwert für diese Komponente
        Application.UseFilter = false;
        Application.SaveButtonState = false;

        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelUser.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelUser.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpaneluser', Ext.ux.MainPanelUser);