Application.ControllerWindowTakeOver = function(anfrageRecord)
{
    this.tmpComponent;
    this.rec = anfrageRecord;

    this.AssignComponent = function(component)
    {
        this.tmpComponent = component;
    }

    this.GetComponent = function()
    {
        return this.tmpComponent;
    }

    this.Init = function()
    {
     
    }

    this.SetListeners = function()
    {
       
    }
}