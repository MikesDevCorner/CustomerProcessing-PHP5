Ext.ux.MainPanelReportBa = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelReportBa.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'reportba',
                    labelWidth:85,
                    defaults:{anchor:'97%',msgTarget: 'side'},
                    items:[{                       
                        xtype:'combo',
                        //editable: false,
                        //allowBlank:false,
                        typeAhead:false,
                        hideTrigger:true,
                        forceSelection:true,
                        listConfig:{
                            loadingText:'Suche...',
                            emptyText:'Keine Region gefunden'
                        },
                        pageSize: Application.PageSize,
                        //triggerAction: 'all',
                        id:'cmbRegionid',
                        //mode:'local',
                        store: new Ext.data.JsonStore({
                            fields: [{name:'id'},{name:'region'}],
                            autoLoad:{params:{start:0, limit: 15}},
                            url:'index.php',
                            id:'regionenstore',
                            totalProperty:'total',
                            baseParams: {cmd:'RegionGetList'},
                            root:'results'
                        }),
                        valueField: 'id',
                        displayField: 'region',
                        //name: 'unwichtig',
                        minChars:2,
                        sbmitValue:false,
                        fieldLabel: 'Region (mind. 2 Zeichen)',
                        hiddenName:'searchregionid'
                    },{
                        xtype:'xdatefield',
                        format:'d.m.Y',
                        invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                        name:'searchregionvon',
                        id:'searchregionvon',
                        msgTarget: 'side',
                        fieldLabel:'Startdatum'
                    },{
                        xtype:'xdatefield',
                        format:'d.m.Y',
                        invalidText : "{0} ist kein gültiges Datum - bitte folgendes Format benützen: {1}",
                        name:'searchregionbis',
                        id:'searchregionbis',
                        msgTarget: 'side',
                        fieldLabel:'Enddatum'
                    }],
                    buttons:[{
                       iconCls:'excel',
                       text:'Download als Excel',
                       formBind:true,
                       handler: function() {
                          window.open("index.php?cmd=ReportBa&PHPSESSID=" + Application.sessionId + "&type=excel&searchregionid="+Ext.getCmp('cmbRegionid').getValue()+"&searchregionvon="+Ext.util.Format.date(Ext.getCmp('searchregionvon').getValue(),'Y-m-d')+"&searchregionbis="+Ext.util.Format.date(Ext.getCmp('searchregionbis').getValue(),'Y-m-d')+"&usefilter=true",'_blank');
                       }
                    },{
                        iconCls:'calculator',
                        text:'Bericht Auswerten',
                        formBind:true,
                        handler: function() {
                            Ext.getCmp('reportba').getForm().submit({
                                url:'index.php',
                                params: {cmd:'ReportBa',usefilter:true},
                                success: function(form,actions) {
                                    var resp = Ext.decode(actions.response.responseText);
                                    Ext.StoreMgr.get('reportbaStore').loadData(resp.results);
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
                    //forceFit:true,
                    columnsText:'Spalten',
                    sortAscText:'aufsteigend sortieren',
                    sortDescText:'absteigend sortieren',
                    emptyText:'Keine Datensätze verfügbar',
                    headersDisabled:true,
                    //scrollOffset:0
                },
                title:'Buchungen pro Region',
                store:new Ext.data.ArrayStore({
                    storeId:'reportbaStore',
                    fields: [
                        'Angebot',
                        'Turnus',
                        'DatumStart',
                        'DatumEnde',
                        'Tage',
                        'Ersatzturnus',
                        'Schule',
                        'Adresse',
                        'Plz',
                        'Ort',
                        'Begleitperson',
                        'Mobil',
                        'Schueler',
                        'Zahlbegleit',
                        'Ges_P',
                        'Notiz',
                        'Quartier',
                        'Status',
                        'Busunternehmen',
                        'Fahrer',
                        'MobilBus',
                        'BusPers',
                        'BusPreis',
                        'BusID',
                        'Zeitplan']
                }),
                columns: [
                    {header:'Angebot', dataIndex:'Angebot', width:110},
                    {header:'Turnus', dataIndex:'Turnus', width:80},
                    {header:'Von', dataIndex:'DatumStart', width:80},
                    {header:'Bis', dataIndex:'DatumEnde', width:80},
                    {header:'Tage', dataIndex:'Tage', width:40},
                    {header:'Ersatzturnus', dataIndex:'Ersatzturnus', width:80},
                    {header:'Schule', dataIndex:'Schule', width:100},
                    {header:'Adresse', dataIndex:'Adresse', width:120},
                    {header:'Plz', dataIndex:'Plz', width:60},
                    {header:'Ort', dataIndex:'Ort', width:120},
                    {header:'Begleitperson', dataIndex:'Begleitperson', width:120},
                    {header:'Handy', dataIndex:'Mobil', width:120},
                    {header:'Schueler', dataIndex:'Schueler', width:60},
                    {header:'Begleit', dataIndex:'Zahlbegleit', width:60},
                    {header:'Ges_P', dataIndex:'Ges_P', width:60},
                    {header:'Notiz', dataIndex:'Notiz', width:150},
                    {header:'Quartier', dataIndex:'Quartier', width:120},
                    {header:'Status', dataIndex:'Status', width:100},
                    {header:'Busunternehmen', dataIndex:'Busunternehmen', width:120},
                    {header:'Busfahrer', dataIndex:'Fahrer', width:120},
                    {header:'Handy-Bus', dataIndex:'MobilBus', width:120},
                    {header:'BusPers', dataIndex:'BusPers', width:120},
                    {header:'BusPreis', dataIndex:'BusPreis', width:60},
                    {header:'BusID', dataIndex:'BusID', width:60},
                    {header:'Zeitplan', dataIndex:'Zeitplan', width:300}
                ],
                sm:new Ext.grid.RowSelectionModel({singleSelect:true})
            }]
        });

        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelReportBa.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelReportBa.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelreportba', Ext.ux.MainPanelReportBa);