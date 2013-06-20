module.exports = function(){

    /**
     * Acts as a base class for all map filters
     * @constructor
     */
    function FilterBase(){

    }

    FilterBase.prototype ={
        /**
         * Performs pre rendering of map inside internal canvas
         * @param {Object} options
         */
        applyPreRenderInternalMap : function(options){

        },

        /**
         * Performs post rendering of map inside internal canvas
         * @param {Object} options
         */
        applyPostRenderInternalMap : function(options){

        },

        /**
         * Performs pre rendering of map inside canvas
         * @param {Object} options
         */
        applyPreRenderMap : function(options){

        },

        /**
         * Performs post rendering of map inside canvas
         * @param {Object} options
         */
        applyPostRenderMap : function(options){

        },
        /**
         * Performs pre rendering before game renders view
         * @param {Object} options
         */
        applyPreRenderGame : function(options){

        },
        /**
         * Performs post rendering after game renders view
         * @param {Object} options
         */
        applyPostRenderGame : function(options){

        },
        /**
         * Performs rendering for player when hide
         * @param {Object} options
         */
         applyFilterForPlayer : function(options){

        }
    };

    return FilterBase;
}();