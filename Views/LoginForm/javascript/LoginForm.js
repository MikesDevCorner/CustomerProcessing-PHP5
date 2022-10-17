/************************
In dieser Javascript-Datei steht der Code zum Aufbau f�r das Login-Fenster. Die Funktion Write_Log_In in der login.php ruft
diese Javascript zu Hilfe um das Loginfenster darzustellen. 
 **********************/
 
 Ext.onReady(function(){
    Ext.QuickTips.init();


    var login = new Ext.FormPanel({
        columnWidth:1,
        labelWidth:150,
        monitorValid:true,
        standardSubmit: true,
        bodyStyle:'padding:17px;background:transparent;',
        border:false,
        defaults:{blankText:'Dieses Feld ist ein Pflichtfeld'},
        defaultType:'textfield',
        items:[{
            fieldLabel:'Benutzername',
            name:'username',
            msgTarget:'side',
            anchor: '98%',
            allowBlank:false
        },{
            fieldLabel:'Passwort',
            name:'passwort',
            msgTarget:'side',
            anchor: '98%',
            inputType:'password',
            id: 'pass',
            allowBlank:false
        }],
        buttons:[{
            text: 'Reset',
            hidden:true,
            width:150,
            iconCls:'deny',
            handler: function(){
                login.getForm().reset();
            }
        },{
            text:'Login',
            formBind:true,
            iconCls:'password',
            width:150,
            handler:function(){
                var fp = this.ownerCt.ownerCt,
                form = fp.getForm();
                form.submit();
            }
        }]
    });
    
    var container = new Ext.Panel({
        layout:'column',
        bodyStyle:'background:transparent;padding:30px;padding-bottom:0px;padding-top:0px;',
        renderTo:'maincontent',
        border:false,
        items:[{
             xtype:'container',
             html:'<img src="Resources/images/64x64/lock_disabled.png"/>',
             width:100
        },login]
    });
    
});  