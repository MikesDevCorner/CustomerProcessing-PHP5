Ext.ux.SubGridAuswahlModel = Ext.extend(Ext.grid.GridPanel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.SubGridAuswahlModel.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        
        var element = this;
        
        Ext.apply(this, {
            layout:'fit',
            viewConfig: {
                forceFit:true,
                columnsText:'Spalten',
                sortAscText:'aufsteigend sortieren',
                sortDescText:'absteigend sortieren',
                emptyText:'Keine Datensätze verfügbar',
                headersDisabled:true,
                scrollOffset:0
            },
            split:'true',
            region:'center',
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            bbar: new Ext.PagingToolbar({
                pageSize: Application.PageSize,
                store: element.initialConfig.store,
                displayMsg:'{0} - {1} von {2}',
                beforePageText:'Seite',
                emptyMsg:'',
                firstText:'erste Seite',
                prevText:'vorherige Seite',
                lastText:'letzte Seite',
                nextText:'nächste Seite',
                refreshText:'aktualisieren',
                afterPageText:'von {0}',
                displayInfo: true
            }),
            stripeRows:true,
            tbar: new Ext.Toolbar({
               items:[{
                   xtype:'displayfield',
                   id:'gridtitle'
               },'->',{
                   iconCls:'add',
                   tooltip:'Eintrag hinzufügen',
                   id:'btn_add'
               },{
                   iconCls:'delete',
                   tooltip:'Eintrag löschen',
                   id:'btn_delete'
               }]
            })
        });
        Ext.ux.SubGridAuswahlModel.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.SubGridAuswahlModel.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
        this.Controller.LoadData();
    }
});
 
//register xtype
Ext.reg('subgridauswahlmodel', Ext.ux.SubGridAuswahlModel);