module.exports = (function(){

    function FilterManager(){
        this._filters={};
        this._currentId = null;
    }

    FilterManager.prototype ={
        register: function(id, filterClass){
            if(! id || !filterClass) return;

            this._filters[id] = {
                filterClass: filterClass
            };
        },
        set : function(id){
            this._currentId = id;
        },
        get: function(){
            if(! this._currentId)
                return;

            if(! this._filters[this._currentId].instance)
                this._filters[this._currentId].instance = new this._filters[this._currentId].filterClass();

            return this._filters[this._currentId].instance;
        }
    };

    return FilterManager;
})();