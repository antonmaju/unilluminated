module.exports =(function(){

    function EscapeBehavior(){

    };

    EscapeBehavior.prototype = {
        getNextMove : function(cb){
            cb(null);
        }
    };

    return EscapeBehavior;
})();