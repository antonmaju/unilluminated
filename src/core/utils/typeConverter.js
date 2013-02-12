var mongo = require('mongodb');

exports.fromString = {
    toInt : function(str){
        if(! str)
            return 0;

        var val = parseInt(str,10);
        if(isNaN(val))
            return 0;

        return val;
    },
    toFloat : function(str){
        if(! str)
            return 0;

        var val = parseFloat(str);
        if(isNaN(val))
            return 0;

        return val;
    },
    toObjectId : function(str){
        try{
            return new mongo.ObjectID(str);
        }
        catch(ex){
            return null;
        }
    }
};