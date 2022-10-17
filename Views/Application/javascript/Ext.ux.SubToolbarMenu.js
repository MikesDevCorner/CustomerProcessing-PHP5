Ext.ux.SubToolbarMenu = Ext.extend(Ext.Toolbar, {
    constructor:function() {
        var configuration=arguments[0] || {};
        if (configuration.Controller)
        {
            configuration.Controller.AssignComponent(this);
        }
        Ext.ux.SubToolbarMenu.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        Ext.apply(this, {
            items: [{
                text:'Reservierungen',
                iconCls:'calendar',
                menu: new Ext.menu.Menu({
                    id: 'reservierungen',
                    items: [{
                        text:'Anfragen',
                        iconCls:'tickets',
                        id:'btn_anfragen'
                    },{
                        text:'Buchungen',
                        iconCls:'shopping',
                        id:'btn_buchungen'
                    }]
                })
            },{
                text:'Verwaltung',
                iconCls:'process',
                menu: new Ext.menu.Menu({
                    id: 'verwaltung',
                    items: [{
                        text:'Dashboard',
                        iconCls:'monitor',
                        id:'btn_dashboard'
                    },{
                        text:'Kundenverwaltung',
                        iconCls:'kunden',
                        id:'btn_kunden'
                    },{
                        text:'Ausschreibungen Busse',
                        iconCls:'ausschreibungen',
                        id:'btn_ausschreibungen'
                    },{
                        text:'Angebotsverwaltung',
                        iconCls:'pakete',
                        id:'btn_angebotsvorlagen'
                    },{
                        text:'Userverwaltung',
                        iconCls:'users',
                        id:'btn_users'
                    },{
                        text:'Meldermaske',
                        iconCls:'windows',
                        id:'btn_eingabemaske',
                        handler: function() {
                            window.open ('index.php?meldermaske','_blank');
                        }
                    }]
                })
            },{
                text:'Stammdaten',
                iconCls:'database',
                menu: new Ext.menu.Menu({
                    id: 'stammdaten',
                    items: [{
                        text:'Partner',
                        iconCls:'user',
                        id:'btn_partner'
                    },{
                        text:'Leistungen',
                        iconCls:'paket',
                        id:'btn_leistungen'
                    },{
                        text:'Quartiere',
                        iconCls:'bett',
                        id:'btn_quartiere'                        
                    },{
                        text:'Busunternehmen',
                        iconCls:'bus',
                        id:'btn_busunternehmen'
                    },{
                        text:'Regionen',
                        iconCls:'globe',
                        id:'btn_regionen'
                    },{
                        text:'Katalogbezieher',
                        iconCls:'archiv',
                        id:'btn_katalogbezieher'
                    },{
                        text:'Turnusse',
                        iconCls:'calendar2',
                        id:'btn_turnusse'
                    }]
                })
            },{
                text:'Berichtswesen',
                iconCls:'diagram',
                menu: new Ext.menu.Menu({
                    id: 'reports',
                    items: [{
                        text:'Buchungen pro Region',
                        iconCls:'reports',
                        id:'btn_buchungenRegion'
                    },{
                        text:'Buchungen pro Partner',
                        iconCls:'reports',
                        id:'btn_buchungenPartner'
                    },{
                        text:'Report für Reservierungsbestätigungen',
                        iconCls:'reports',
                        id:'btn_buchungsbestaetigung'
                    },{
                        text:'Report für Quartiere',
                        iconCls:'reports',
                        id:'btn_buchungQuartiere'
                    }]
                })
            },{
                text:'Hilfe',
                iconCls:'help',
                menu: new Ext.menu.Menu({
                    id: 'hilfe',
                    items: [/*{
                        text:'Version Info',
                        iconCls:'',
                        id:'btn_version'
                    },*/{
                        text:'Anleitung',
                        iconCls:'tutorial',
                        id:'btn_anleitung',
                        handler: function() {
                            window.open ("index.php?help","_blank");
                        }
                    },{
                        text:'Über',
                        iconCls:'version',
                        id:'btn_about',
                        handler: function() {
                            Ext.Msg.show({
                                 title:'About...',
                                 msg: '<b>'+Application.title+'</b><br/>Version '+Application.version+'<br/>(c) 2011 by <a href="http://widmayer.at/" target="_blank">Roland Widmayer</a> und <a href="http://froot.at" target="_blank" >Michael Wagner</a><br/><br/>Diese Software basiert auf dem AJAX-Framework ExtJs in der Version 3.4.0 und PHP in der Version 5',
                                 buttons: Ext.Msg.OK,
                                 icon: Ext.Msg.INFO
                            });
                        }
                    },{
                        text:'Changelog',
                        iconCls:'log',
                        id:'btn_changelog',
                        handler: function() {
                            
                            //Expanderplugin für HinweiseGrid
                            var expander = new Ext.ux.grid.RowExpander({
                                tpl : new Ext.Template(
                                    '<p><b>Beschreibung:</b><br />{text}</p>'
                                )
                            });
                            
                            var win = new Ext.Window({
                                layout:'fit',
                                modal:true,
                                height:400,
                                width:600,
                                title:'Changelog',
                                iconCls:'log',
                                items:[{
                                    xtype:'grid',
                                    border:false,
                                    stripeRows: true,
                                    viewConfig: {
                                        forceFit:true
                                    },
                                    animCollapse: false,
                                    store: new Ext.data.Store({
                                        autoLoad:true,
                                        proxy: new Ext.data.HttpProxy({
                                            url: 'index.php',
                                            method: 'POST'
                                        }),
                                        storeId:'changeLog',
                                        baseParams:{
                                            cmd: "ChangelogGetList"
                                        },
                                        reader: new Ext.data.JsonReader({
                                            root: 'results',
                                            totalProperty: 'total'
                                        },Ext.data.Record.create([
                                             {name: 'id', type:'int'},
                                             {name: 'date', type:'date', dateFormat: 'Y-m-d'},
                                             {name: 'version', type:'string'},
                                             {name: 'text', type:'string'}
                                          ])
                                        )
                                    }),
                                    columns: [
                                        expander,
                                        {header: "Datum", width: 30, sortable: true, xtype: 'datecolumn', format: 'd.m.Y', dataIndex: 'date'},
                                        {header: "Version", width: 135, sortable: true, dataIndex: 'version'}
                                    ],
                                    sm: new Ext.grid.RowSelectionModel({
                                        singleSelect:true
                                    }),
                                    plugins: expander
                                }]
                            });
                            win.show();
                        }
                    }]
                })
            },'->',{
                text:'Abmelden',
                iconCls:'logout',
                id:'btn_logout'
            }]
        });
        Ext.ux.SubToolbarMenu.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.SubToolbarMenu.superclass.onRender.apply(this, arguments);
        this.Controller.Init();
        this.Controller.SetListeners();
    }
});
 
//register xtype
Ext.reg('subtoolbarmenu', Ext.ux.SubToolbarMenu);