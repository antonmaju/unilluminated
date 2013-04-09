module.exports =(function(){

    function ChaseBehavior(){

    }

    ChaseBehavior.prototype ={
        setTarget: function(){
            
        },
        setCurrentPosition: function(){

        },
        getNextMove : function(cb){
            cb(null);
        }
    };

    return ChaseBehavior;
})();