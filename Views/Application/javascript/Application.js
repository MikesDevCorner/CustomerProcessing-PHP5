Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = 'Resources/ext3/resources/images/default/s.gif';
    Ext.Msg.buttonText.yes = "Ja";
    Ext.Msg.buttonText.no = "Nein";
    Ext.Msg.buttonText.cancel = "Abbrechen";
    Ext.form.VTypes.emailText = "Bitte geben Sie eine E-Mail Adresse im Format foo@bogus.at an.";

    Ext.Ajax.url="index.php";
    Ext.Ajax.extraParams = {PHPSESSID: Application.sessionId};
    Ext.Ajax.method = 'POST';

    //NORTHBOX
    var logo ='<img height="37" src="Resources/images/'+Application.logo+'" alt="logo" />';
    var logobereich = new Ext.Panel({
        region:'north',
        height:45,
        border:false,
        id:'northbox',
        html:'<div style="float:right;padding:4px;padding-right:5px;">'+logo+'</div><div class="htitle">'+Application.title+':&nbsp;&nbsp;E<span style="font-weight:normal;">nterprise </span>R<span style="font-weight:normal;">esource </span>P<span style="font-weight:normal;">lanning</span></div>',
        layout:'fit',
        collapsible:false
    });
    
    //SOUTHBOX
    var footer = new Ext.Panel({
        region:'south',
        bodyStyle:'background-color: #E1E8EF;color:#15428B;padding-left:5px;padding-right:10px;padding-top:5px;',
        height:25,
        html:'<div style="float:left;">'+Application.title+' '+Application.version+'</div><div style="float:right;">...powered by <a href="http://froot.at" target="_blank">froot.at</a> and <a href="http://widmayer.at" target="_blank">widmayer.at</a></div>',
        border:false,
        id:'southbox',
        layout:'fit',
        collapsible:false
    });

    //Der Mainbereich für den Hauptinhalt:
    var anzeigebereich = new Ext.Panel({
        region:'center',
        id:'anzeigebereich',
        tbar: {
            xtype:'subtoolbarmenu',
            Controller: new ControllerSubToolbarMenu()
        },
        bodyStyle:'padding:4px;background:#F7F7F7;',
        frame:false,
        layout:'fit',
        items:[]
    });
    
    Application.changeView(anzeigebereich, new Ext.ux.MainPanelDashboard({id:'panel_dashboard'}));

    //Viewport --> document.body
    var viewport=new Ext.Viewport ({
        layout:'border',
        items:[logobereich,anzeigebereich,footer]
    });

    //Quick-Tipps ermöglichen und den Singleton einige Einstellungen mitgeben :)
    Ext.QuickTips.init();
    Ext.apply(Ext.QuickTips.getQuickTip(), {
        maxWidth: 250,
        minWidth: 100,
        showDelay: 7,
        trackMouse: false
    });

    //Ausblenden des Loading-Prozessbar nachdem alles geladen wurde
    Ext.get('loading').fadeOut({remove: false});
});