Ext.ux.MainPanelDashboard = Ext.extend(Ext.ux.Portal, {
    constructor:function() {
        var configuration=arguments[0] || {};
        Ext.ux.MainPanelDashboard.superclass.constructor.apply(this,new Array(configuration));
    },
    initComponent:function() {
        
        var now = new Date();
        
        Ext.Ajax.request({
           url:'index.php',
           params:{cmd:'Dashboard',mode:'allgemein'},
           success: function(response) {
               var resp = Ext.decode(response.responseText);
               Ext.getCmp('userPortlet').update("Willkommen, <b>"+resp.user+"</b>!<br>Ihr Benutzerkonto "+(resp.schreiben?"besitzt":"besitzt <b>keine</b>")+" Schreiberechte.<br/><br/>Falls Sie auf dieser Seite keine Diagramme sehen, bitte installieren Sie die neuste Version des <a href = 'http://get.adobe.com/de/flashplayer/' target='_blank'>Adobe Flash Players.</a>");
               Ext.getCmp('buchungenTextPortlet').update("Es befinden sich <b>"+resp.anzBuchung+"</b> Buchungen im System, davon sind<br/><br/>... <b>"+resp.anzBuchungGebucht+"</b> Buchungen im Status gebucht<br/>... <b>"+resp.anzBuchungBest+"</b> Buchungen im Status bestätigt<br/>... <b>"+resp.anzBuchungAbg+"</b> Buchungen im Staus abgeschlossen<br/>... <b>"+resp.anzBuchungArchiv+"</b> Buchungen wurden archiviert<br/><br/><br/><br/><br/>Es befinden sich <b>"+resp.anzAnfragen+"</b> Anfragen im System, davon <b>"+resp.anzAnfragenunb+"</b> unbearbeitet.");
               Ext.getCmp('busausschreibungsPortlet').update("<br/>Aktuell befinden sich <b>"+resp.anzAusschreibungen+"</b> Busausschreibungen mit einem Datum, welches in der Zukunft liegt, im System. <br/>Davon ist bei <b>"+resp.anzAusschreibungenSieger+"</b> bereits ein Ausschreibungssieger ermittelt.<br/><br/><br/>Insgesamt sind bereits <b>"+resp.anzAusschreibungenInsg+"</b> Ausschreibungen mit dieser Software abgewickelt worden.");
           }
        });
        
        
        
        Ext.apply(this, {
            margins:'35 5 5 0',
            border:false,
            bodyStyle:'background:#F7F7F7;',
            items:[{
                columnWidth:.33,
                defaults:{bodyStyle:'background:#E1E8EF;'},
                style:'padding:10px 0 10px 10px',
                items:[{
                    title: 'Angemeldeter User',
                    id:'userPortlet',
                    bodyStyle:'padding:10px;padding-top:5px;background:#E1E8EF;color:#15428B;',
                    height:110
                },{
                    title: 'Ihre letzten Tätigkeiten:',
                    bodyStyle:'background:#E1E8EF;padding-top:10px;color:#15428B;',
                    layout:'fit',
                    items:[{
                        xtype:'grid',
                        id:'historyPortlet',
                        hideHeaders:true,
                        bodyStyle:'background:#E1E8EF;color:#15428B;',
                        store: new Ext.data.JsonStore({
                            storeId:'historyStore',
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'HistoryGetList'},
                            autoLoad:{params:{start:0,limit:18}},
                            fields:[{name:'date',type:'date',dateFormat:'Y-m-d H:i:s'},'datenbereich','id_dataset','action']
                        }),
                        bbar: new Ext.PagingToolbar({
                            pageSize: 18,
                            store: 'historyStore',
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
                        sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
                        viewConfig: {
                            forceFit: true,
                            scrollOffset:0
                        },
                        border:false,
                        columns: [
                            {xtype:'datecolumn',format:'d.m.Y',header:'Datum',dataIndex:'date',width:25},
                            {xtype:'datecolumn',format:'H:i',header:'Uhrzeit',dataIndex:'date',width:25},
                            {header:'Bereich',dataIndex:'datenbereich',width:40},
                            {header:'Nr',dataIndex:'id_dataset',width:15},
                            {header:'Aktion',dataIndex:'action',width:55}
                        ]
                    }],
                    height:478
                }]
            },{
                columnWidth:.33,
                defaults:{bodyStyle:'background:#E1E8EF;'},
                style:'padding:10px 0 10px 10px',
                items:[{
                    title: 'Buchungen Jahresverlauf',
                    layout:'fit',
                    height:238,
                    items:[{
                        xtype: 'linechart',
                        extraStyle: {
                            background: {
                                color: '#E1E8EF'
                            }
                        },
                        seriesStyles: {
                            color: '#15429A',
                            size:15,
                            alpha: 0.8,
                            lineColor:'#15429A',
                            lineSize:1,
                            lineAlpha:0.8
                        },
                        store: new Ext.data.JsonStore({
                            storeId:'buchungenJahresStore',
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'Dashboard',mode:'buchungenJahr'},
                            autoLoad:true,
                            fields:['name','anzahl']                            
                        }),
                        xField: 'name',
                        yField: 'anzahl'
                    }]
                },{
                    title: 'Buchungen aktuell',
                    height:350,
                    layout:'hbox',
                    layoutConfig:{align:'stretch'},
                    items:[{
                        xtype:'barchart',
                        flex:1,
                        store: new Ext.data.JsonStore({
                            storeId:'buchungsMonateStore',
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'Dashboard',mode:'buchungenMonate'},
                            autoLoad:true,
                            fields:['name','anzahl']         
                        }),
                        xField: 'anzahl',
                        yField: 'name',
                        extraStyle: {
                            background: {
                                color: '#E1E8EF'
                            }
                        },
                        seriesStyles: {
                            color: '#15429A',
                            alpha: 0.8
                        }
                        //yAxis: new Ext.chart.CategoryAxis({
                        //    title: 'Monate'
                        //}),
                        //xAxis: new Ext.chart.NumericAxis({
                        //    title: 'Anzahl eingelangter Buchungen'
                        //})
                    },{
                        xtype:'panel',
                        id:'buchungenTextPortlet',
                        bodyStyle:'background:transparent;color:#15428B;padding:10px;',
                        border:false,
                        flex:1
                    }]
                }]
            },{
                columnWidth:.33,
                defaults:{bodyStyle:'background:#E1E8EF;'},
                style:'padding:10px',
                items:[{
                    title: 'Buchungen / Region '+now.getFullYear()+' - Top 4',
                    layout:'fit',
                    height:193,
                    items:[{
                        xtype: 'columnchart',
                        extraStyle: {
                            background: {
                                color: '#E1E8EF'
                            }
                        },
                        seriesStyles: {
                            color: '#15429A',
                            size:30,
                            alpha: 0.8
                        },
                        store: new Ext.data.JsonStore({
                            storeId:'buchungenRegionStore',
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'Dashboard',mode:'buchungenRegion'},
                            autoLoad:true,
                            fields:['name','anzahl']                            
                        }),
                        xField: 'name',
                        yField: 'anzahl'
                    }]
                },{
                    title: 'Buchungen / Kunde '+now.getFullYear()+' - Top 4',
                    layout:'fit',
                    height:193,
                    items:[{
                        xtype: 'columnchart',
                        extraStyle: {
                            background: {
                                color: '#E1E8EF'
                            }
                        },
                        seriesStyles: {
                            color: '#15429A',
                            size:40,
                            alpha: 0.8
                        },
                        store: new Ext.data.JsonStore({
                            storeId:'buchungenKundenStore',
                            url:'index.php',
                            root:'results',
                            baseParams:{cmd:'Dashboard',mode:'buchungenKunde'},
                            autoLoad:true,
                            fields:['name','anzahl']                            
                        }),
                        xField: 'name',
                        yField: 'anzahl'
                    }]
                },{
                    title: 'Busausschreibungen',
                    id:'busausschreibungsPortlet',
                    bodyStyle:'padding:10px;background:#E1E8EF;color:#15428B;',
                    height:192
                }]
            }]
        });

        
        Ext.ux.MainPanelDashboard.superclass.initComponent.call(this);
    },
    onRender:function() {
        Ext.ux.MainPanelDashboard.superclass.onRender.apply(this, arguments);
    }
});
 
//register xtype
Ext.reg('mainpaneldashboard', Ext.ux.MainPanelDashboard);