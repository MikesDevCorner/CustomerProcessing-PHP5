Ext.ux.MainPanelReportBu = Ext.extend(Ext.Panel, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelReportBu.superclass.constructor.apply(this,new Array(configuration));
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
                    id:'reportbu',
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
                            emptyText:'Keine Buchung zur Region gefunden',
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
                          window.open("index.php?cmd=ReportBu&PHPSESSID=" + Application.sessionId + "&type=excel&searchregionid="+Ext.getCmp('cmbRegionid').getValue()+"&searchregionvon="+Ext.util.Format.date(Ext.getCmp('searchregionvon').getValue(),'Y-m-d')+"&searchregionbis="+Ext.util.Format.date(Ext.getCmp('searchregionbis').getValue(),'Y-m-d')+"&usefilter=true",'_blank');
                       }
                    },{
                        iconCls:'calculator',
                        text:'Bericht Auswerten',
                        formBind:true,
                        handler: function() {
                            Ext.getCmp('reportbu').getForm().submit({
                                url:'index.php',
                                params: {cmd:'ReportBu',usefilter:true},
                                success: function(form,actions) {
                                    var resp = Ext.decode(actions.response.responseText);
                                    Ext.StoreMgr.get('reportbuStore').loadData(resp.results);
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
                    storeId:'reportbuStore',
                    fields: [
                        'name_schule',
                        'begleitperson',
                        'strasse_schule',
                        'plz_schule',
                        'ort_schule',
                        'angebotsname',
                        'datum',
                        'turnus_ende',
                        'quartier_name',
                        'schueler',
                        'zahlbegleit',
                        'abfahrtszeit_schule',
                        'ankunftszeit_schule',
                        'preis_schueler',
                        'preis_begleit',
                        'preis_bus']
                }),
                columns: [
                    {header:'Schule', dataIndex:'name_schule', width:60},
                    {header:'Ansprechperson', dataIndex:'begleitperson', width:60},
                    {header:'Adresse', dataIndex:'strasse_schule', width:60},
                    {header:'Plz', dataIndex:'plz_schule', width:40},
                    {header:'Ort', dataIndex:'ort_schule', width:60},
                    {header:'Programm', dataIndex:'angebotsname', width:80},
                    {header:'Beginn', dataIndex:'datum', width:40},
                    {header:'Ende', dataIndex:'turnus_ende', width:40},
                    {header:'Schüler', dataIndex:'schueler', width:40},
                    {header:'Begleitpers', dataIndex:'zahlbegleit', width:40},
                    {header:'Quartier', dataIndex:'quartier_name', width:40},
                    {header:'Abfahrtszeit', dataIndex:'abfahrtszeit_schule', width:40},
                    {header:'Ankunftszeit', dataIndex:'ankunftszeit_schule', width:40},
                    {header:'Preis Schüler', dataIndex:'preis_schueler', width:40},
                    {header:'Preis Begleitp.', dataIndex:'preis_begleit', width:40},
                    {header:'Preis Bus.', dataIndex:'preis_bus', width:40}
                ],
                sm:new Ext.grid.RowSelectionModel({singleSelect:true})
            }]
        });

        //Aufrufen des Parent-Inits
        Ext.ux.MainPanelReportBu.superclass.initComponent.call(this);
    },
    onRender:function() {
        //Aufrufen des Parent-OnRenders
        Ext.ux.MainPanelReportBu.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpanelreportbu', Ext.ux.MainPanelReportBu);