module.exports = (function(){

    /***
     * ViewManager is responsible for managing game view
     */

    var ViewManager = function(){
        this._views =[];
    };

    ViewManager.prototype = {
        currentView : null,

        /**
         * Add a view to ViewManager instance
         * @param {Object} view
         */
        addView : function(view){
            this._views.push(view);
        },

        /**
         * Add multiple views to ViewManager instance
         * @param views
         */
        addViews: function(views){
            this._views.push.apply(this._views, views);
        },


        /**
         * Set current view
         * @param {String} viewId
         */
        setView : function(viewId){

            for(var i=0; i< this._views.length; i++)
            {
                if(this._views[i].id == viewId)
                {
                    this.currentView = this._views[i];
                    break;
                }
            }
        }
    };

    return ViewManager;

})();

