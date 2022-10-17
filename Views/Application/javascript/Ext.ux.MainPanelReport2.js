Ext.ux.MainPanelReport2 = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelReport2.superclass.constructor.apply(this,new Array(configuration));
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
                border:false,
                layout:'vbox',
                layoutConfig:{align:'stretch'},
                width:300,
                split:true,
                items:[{
                    xtype:'form',
                    bodyStyle:'padding:15px;',
                    frame:true,
                    title:'Kriterien',
                    monitorValid:true,
                    width:300,
                    height:200,
                    id:'report2',
                    labelWidth:85,
                    defaults:{anchor:'97%',msgTarget: 'side'},
                    items:[{
                        xtype:'combo',
                        //editable: false,
                        //allowBlank:false,
                        typeAhead:false,
                        hideTrigger:true,
                        forceSelection:true,
                        listConfit: {
                            loadingText: 'Suche...',
                            emptyText: 'Keine Partner gefunden'
                        },
                        pageSize: Application.PageSize,
                        minChars: 2,
                        //triggerAction: 'all',
                        id:'cmbPartnerid',
                        //mode:'local',
                        store: new Ext.data.JsonStore({
                            fields: [{name:'id'},{name:'firmenname'}],
                            autoLoad:{params:{start:0, limit: 15}},
                            url:'index.php',
                            id:'partnerstore',
                            totalProperty:'total',
                            baseParams: {cmd:'PartnerGetList'},
                            root:'results'
                        }),
                        valueField: 'id',
                        displayField: 'firmenname',
                        //name: 'unwichtig',
                        fieldLabel: 'Partner mind. 2 Zeichen',
                        hiddenName:'searchpartnerid'
                    },{
                        xtype:'xdatefield',
                        format:'d.m.Y',
                        invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                        name:'searchpartnervon',
                        id:'searchpartnervon',
                        msgTarget: 'side',
                        fieldLabel:'Startdatum'
                    },{
                        xtype:'xdatefield',
                        format:'d.m.Y',
                        invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                        name:'searchpartnerbis',
                        id:'searchpartnerbis',
                        msgTarget: 'side',
                        fieldLabel:'Enddatum'
                    }],
                    buttons:[{
                       iconCls:'excel',
                       text:'Download als Excel',
                       formBind:true,
                       handler: function() {
                          window.open("index.php?cmd=Report2&PHPSESSID=" + Application.sessionId + "&type=excel&searchpartnerid="+Ext.getCmp('cmbPartnerid').getValue()+"&searchpartnervon="+Ext.util.Format.date(Ext.getCmp('searchpartnervon').getValue(),'Y-m-d')+"&searchpartnerbis="+Ext.util.Format.date(Ext.getCmp('searchpartnerbis').getValue(),'Y-m-d')+"&usefilter=true",'_blank');
                       }
                    },{
                        iconCls:'calculator',
                        text:'Bericht Auswerten',
                        formBind:true,
                        handler: function() {
                            Ext.getCmp('report2').getForm().submit({
                                url:'index.php',
                                params: {cmd:'Report2',usefilter:true},
                                success: function(form,actions) {
                                    var resp = Ext.decode(actions.response.responseText);
                                    Ext.StoreMgr.get('report2Store').loadData(resp.results);
                                }
                            });
                        }
                    }]
                }]
            },{
                xtype:'grid',
                split:true,
                stripeRows:true,
                region:'center',
                viewConfig: {
                    forceFit:true,
                    columnsText:'Spalten',
                    sortAscText:'aufsteigend sortieren',
                    sortDescText:'absteigend sortieren',
                    emptyText:'Keine Datensätze verfügbar',
                    headersDisabled:true,
                    scrollOffset:0
                },
                title:'Buchungen pro Partner',
                store:new Ext.data.ArrayStore({
                    storeId:'report2Store',
                    fields: [
                        'Partner',
                        'Leistung',
                        'Datum',
                        'Uhrzeit',
                        'Angebot',
                        'Schule',
                        'Begleitperson',
                        'Handy',
                        'S_W',
                        'S_M',
                        'L_W',
                        'L_M',
                        'Gesamtpersonen',
                        'Vegi',
                        'Muslime',
                        'Status']
                }),
                columns: [
                    {header:'Partner', dataIndex:'Partner', width:40},
                    {header:'Leistung', dataIndex:'Leistung', width:40},
                    {header:'Datum', dataIndex:'Datum', width:80},
                    {header:'Uhrzeit', dataIndex:'Uhrzeit', width:40},
                    {header:'Angebot', dataIndex:'Angebot', width:40},
                    {header:'Schule', dataIndex:'Schule', width:80},
                    {header:'Begleitperson', dataIndex:'Begleitperson', width:80},
                    {header:'Handy', dataIndex:'Handy', width:40},
                    {header:'S-W', dataIndex:'S_W', width:40},
                    {header:'S-M', dataIndex:'S_M', width:40},
                    {header:'L-M', dataIndex:'L_M', width:40},
                    {header:'L-W', dataIndex:'L_W', width:40},
                    {header:'Gesamtpersonen', dataIndex:'Gesamtpersonen', width:40},
                    {header:'Vegi', dataIndex:'Vegi', width:40},
                    {header:'Muslime', dataIndex:'Muslime', width:40},
                    {header:'Status', dataIndex:'Status', width:40}

                ],
                sm:new Ext.grid.RowSelectionModel({singleSelect:true})
            }]
        });
        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelReport2.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelReport2.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelreport2', Ext.ux.MainPanelReport2);