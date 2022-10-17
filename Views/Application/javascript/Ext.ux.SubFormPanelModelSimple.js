Ext.ux.SubFormPanelModelSimple = Ext.extend(Ext.form.FormPanel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.SubFormPanelModelSimple.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            tbar: new Ext.Toolbar({
                id:'formToolbar',
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
                }/*,{
                   tooltip:'PDF Datei generieren',
                   iconCls:'pdf',
                   disabled:true,
                   id:'btn_pdf'
                }*/,{
                   tooltip:'Mail senden',
                   hidden:true,
                   iconCls:'email',
                   disabled:true,
                   id:'btn_email'
                }]
            }),
            border:true,
            monitorValid:true,
            layout:'fit',
            autoScroll:true,
            labelWidth:140,
            region:'center',
            bodyStyle:'padding:8px; padding-left:15px; background:#efefef;',
            split:true,
            items: [{
                xtype:'panel',
                bodyStyle:'background:transparent;',
                id:'formarea',
                border:false,
                layout:'fit',
                items:[]
            }]
        });
        Ext.ux.SubFormPanelModelSimple.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.SubFormPanelModelSimple.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
    }
});
 
//register xtype
Ext.reg('subformpanelmodelsimple', Ext.ux.SubFormPanelModelSimple);