module.exports =(function(){

    function ChaseBehavior(){

    }

    ChaseBehavior.prototype ={
        getNextMove : function(cb){
            cb(null);
        }
    };

    return ChaseBehavior;
})();