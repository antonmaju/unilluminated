module.exports = (function(){

    /**
     * This class is reponsible for managing map filters
     * @constructor
     */
    function FilterManager(){
        this._filters={};
        this._currentId = null;
    }

    FilterManager.prototype ={
        /**
         * Registers new filter
         * @param {string} id
         * @param {Object} filterClass
         */
        register: function(id, filterClass){
            if(! id || !filterClass) return;

            this._filters[id] = {
                filterClass: filterClass
            };
        },
        /**
         * Sets current active filter by its id
         * @param {string} id
         */
        set : function(id){
            this._currentId = id;
        },

        /**
         * Gets current active filter instance
         * @returns {object}
         */
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