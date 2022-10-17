Ext.ux.SubContainerPanelModel = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.SubContainerPanelModel.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            tbar: new Ext.Toolbar({
                id:'containerToolbar',
                items:[{
                   tooltip:'Änderungen speichern',
                   iconCls:'save',
                   disabled:true,
                   id:'btn_speichern'
                },{
                   tooltip:'Abbrechen und veränderte Daten verwerfen',
                   iconCls:'deny',
                   disabled:true,
                   id:'btn_abbrechen'
                },'-',{
                   tooltip:'Drucken',
                   iconCls:'print',
                   disabled:true,
                   id:'btn_drucken'
                },{
                   tooltip:'Mail senden',
                   hidden:true,
                   iconCls:'email',
                   disabled:true,
                   id:'btn_email'
                }]
            }),
            border:true,
            layout:'vbox',
            layoutConfig: {
                align: 'stretch'
            },
            region:'center',
            split:true,
            items: [{
                xtype:'form',
                id:'formarea',
                monitorValid:true,
                border:false,
                bodyStyle:'padding:8px; padding-left:15px; padding-bottom:0px; background:#efefef',
                autoScroll:true,
                layout:'column',
                items:[{
                    xtype:'panel',
                    bodyStyle:'background:transparent; padding-right:5px;',
                    id:'leftfield',
                    layout:'anchor',
                    defaults:{
                        autoHeight:true,
                        collapsible:false
                    },
                    columnWidth:.5,
                    border:false
                },{
                    xtype:'panel',
                    bodyStyle:'background:transparent; padding-left:5px;',
                    id:'rightfield',
                    layout:'anchor',
                    defaults:{
                        autoHeight:true,
                        collapsible:false
                    },
                    columnWidth:.5,
                    border:false
                }]
            },{
                xtype:'tabpanel',
                //bodyStyle:'padding:8px; padding-left:15px; padding-right:0px; background:#efefef;',
                flex:1,
                deferredRender: false,
                id:'tabarea',
                border:false
            }]
        });
        Ext.ux.SubContainerPanelModel.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.SubContainerPanelModel.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
    }
});
 
//register xtype
Ext.reg('subcontainerpanelmodel', Ext.ux.SubContainerPanelModel);