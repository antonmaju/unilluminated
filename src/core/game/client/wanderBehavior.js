module.exports = (function(){

    var GameUtils = require('../commonUtils');

    function WanderBehavior(options){

        var defaults = {
            sightRadius:10,
            isSingleMap:true
        };

        this.options = GameUtils.extends({}, defaults, options);
        this._path = [];

    }

    WanderBehavior.prototype = {

        setPosition: function(){

        },

        getNextMove : function(cb){
            cb(null);
        }

    };

    return WanderBehavior;

})();