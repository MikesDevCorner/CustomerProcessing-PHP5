Ext.ux.MainPanelReport1 = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelReport1.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'report1',
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
                            emptyText:'Keine Region gefunden',
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
                          window.open("index.php?cmd=Report1&PHPSESSID=" + Application.sessionId + "&type=excel&searchregionid="+Ext.getCmp('cmbRegionid').getValue()+"&searchregionvon="+Ext.util.Format.date(Ext.getCmp('searchregionvon').getValue(),'Y-m-d')+"&searchregionbis="+Ext.util.Format.date(Ext.getCmp('searchregionbis').getValue(),'Y-m-d')+"&usefilter=true",'_blank');
                       }
                    },{
                        iconCls:'calculator',
                        text:'Bericht Auswerten',
                        formBind:true,
                        handler: function() {
                            Ext.getCmp('report1').getForm().submit({
                                url:'index.php',
                                params: {cmd:'Report1',usefilter:true},
                                success: function(form,actions) {
                                    var resp = Ext.decode(actions.response.responseText);
                                    Ext.StoreMgr.get('report1Store').loadData(resp.results);
                                }
                            });
                        }
                    }]
                },{
                    xtype:'panel',
                    margins:{top:5,right:0,left:0,bottom:0},
                    frame:true,
                    title:'Top 5 Regionen',
                    flex:1,
                    layout:'fit',
                    items:[{
                        xtype: 'barchart',
                        extraStyle: {
                            background: {
                                color: '#DFE8F6'
                            }
                        },
                        seriesStyles: {
                            color: '#15429A',
                            size:30,
                            alpha: 0.8
                        },
                        store: new Ext.data.JsonStore({
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'Dashboard',mode:'buchungenRegion'},
                            autoLoad:true,
                            fields:['id','name','anzahl']                         
                        }),
                        yField: 'name',
                        xField: 'anzahl'
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
                title:'Buchungen pro Region',
                store:new Ext.data.ArrayStore({
                    storeId:'report1Store',
                    fields: [
                        'Angebot',
                        'DatumStart',
                        'DatumEnde',
                        'Tage',
                        'Schule',
                        'Adresse',
                        'Plz',
                        'Ort',
                        'Begleitperson',
                        'Mobil',
                        'W',
                        'M',
                        'LW',
                        'LM',
                        'Vegi',
                        'Muslime',
                        'Quartier',
                        'Status',
                        'Busunternehmen']
                }),
                columns: [
                    {header:'Angebot', dataIndex:'Angebot', width:40},
                    {header:'Von', dataIndex:'DatumStart', width:40},
                    {header:'Bis', dataIndex:'DatumEnde', width:40},
                    {header:'Tage', dataIndex:'Tage', width:40},
                    {header:'Schule', dataIndex:'Schule', width:80},
                    {header:'Adresse', dataIndex:'Adresse', width:40},
                    {header:'Plz', dataIndex:'Plz', width:40},
                    {header:'Ort', dataIndex:'Ort', width:80},
                    {header:'Begleitperson', dataIndex:'Begleitperson', width:80},
                    {header:'Handy', dataIndex:'Mobil', width:40},
                    {header:'S-W', dataIndex:'W', width:40},
                    {header:'S-M', dataIndex:'M', width:40},
                    {header:'L-M', dataIndex:'LM', width:40},
                    {header:'L-W', dataIndex:'LW', width:40},
                    {header:'Vegi', dataIndex:'Vegi', width:40},
                    {header:'Muslime', dataIndex:'Muslime', width:40},
                    {header:'Quartier', dataIndex:'Quartier', width:80},
                    {header:'Status', dataIndex:'Status', width:40},
                    {header:'Busunternehmen', dataIndex:'Busunternehmen', width:80}
                ],
                sm:new Ext.grid.RowSelectionModel({singleSelect:true})
            }]
        });

        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelReport1.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelReport1.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelreport1', Ext.ux.MainPanelReport1);