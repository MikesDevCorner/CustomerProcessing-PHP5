Ext.namespace('Application');

//Javascript-Lokale Variablen zum alltäglichen Gebrauch:
Application.PageSize = 15;
Application.SaveButtonState = false;
Application.UseFilter = false;

//schickt alle 15sek einen asynchronen Request an den Server und reloaded den store.
//Diese Funktion statt der initialen store.load Function benützen.
Application.pollForChanges = function(grid,first) {
    //beim ersten Aufruf dieser Funktion, wird der store nicht reloaded
    ////sondern es erfolgt der initiale LOAD-Aufruf.
    if (first == true) {
        grid.getStore().load({
            params:{start:0, limit:Application.PageSize},
            //Initialer Load mit Fehlerbehandlung
            callback: function(rec,opti,succ) {
                if (grid.getStore()!=null) {
                    var JSON_Data = grid.getStore().reader.jsonData;
                    if(JSON_Data.error==true) { //FEHLERBEHANDLUNG
                        Ext.example.msg("Type: "+JSON_Data.type, JSON_Data.message);
                    } else {
                        //if(JSON_Data.total == 0) {
                            //Ext.example.msg('Status', 'Noch keine Daten in diesem Bereich vorhanden.');
                        //}
                    }
                }
            }
        });
        setTimeout(function(){Application.pollForChanges(grid,false);}, 30000);
    }
    else {
        //wenn ein Datensatz bearbeitet wird, darf nicht gepolled werden, da ein reload des stores während einige Felder 'dirty' sind
        //kein Update in der Datenbank der schmutigen Felder auslöst. Während des Bearbeitens eines Datensatzes wird die selbst
        // eingebrachte Eigenschaft _pollEnabled im Store auf false gesetzt, erst danach kann wieder gepolled werden.
        if (grid.getStore()!=null) {
            if(grid.getStore()._pollEnabled == true) {
                grid.getStore().reload({
                    callback: function(rec,opti,succ) {
                        //unabhängig von success oder failure wird in 15sek wieder ein call abgesetzt.
                        //Bei den reloads im 15 Sekunden-Takt wollen wir keine Fehlerbehandlung.
                        //Auch wenn der Server nicht erreichbar war oder ein anderer Fehler auftrat
                        //wollen wir den User damit nicht behelligen. Das aktuell halten der Datensätze
                        //in den Stores soll unauffällig und im Hintergrund passieren.
                        setTimeout(function(){Application.pollForChanges(grid,false);}, 30000);
                    }
                });
            }
        }
    }
}

//****************************************************************************************************************

//V-Type zur Validierung von Passwörtern beim Ändern durch User
Ext.apply(Ext.form.VTypes, {
    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText : 'Passwörter stimmen nicht zusammen.'
});

//****************************************************************************************************************

//Exceptionhandling im JS
Application.handleException = function (err) {
    Ext.example.msg("Type: "+err.type, err.message); //weiter Unterscheidung mit Fehler-Objekt
}

//****************************************************************************************************************

//Ändern des Anzeigenelementes
Application.changeView = function(anzeige, addAble)
{
    anzeige.removeAll();
    anzeige.add(addAble);
    anzeige.doLayout();
}

Application.deactivedRenderer = function(val,meta,rec)
{
    if(Application.UseFilter == true && Ext.getCmp('searcharchiv').getValue() == true)
    {
        if(rec.data.aktiv == false)
        {
            meta.css = 'lightred';
        }
        else
        {
            meta.css = 'lightgreen';
        }        
    }
    return val;
}


Application.deactivedDateRenderer = function(val,meta,rec) 
{
    if(Application.UseFilter == true && Ext.getCmp('searcharchiv').getValue() == true)
    {
        if(rec.data.aktiv == false)
        {
            meta.css = 'lightred';
        }
        else
        {
            meta.css = 'lightgreen';
        }
    }
    return Ext.util.Format.date(val, 'd.m.Y');
}