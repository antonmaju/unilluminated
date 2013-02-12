var dbHelpers = require('../utils/dbHelpers'),
    typeConverter=require('../utils/typeConverter');

var collName = 'Game';

function hasError(client, err, callback){
    if(err){
        client.close();
        callback({error: err});
        return true;
    }
    return false;
}

exports.create = function(model, callback){
    function validateModel(){

        if(! model.mode)
            return {message:'Mode is required'};

        if(! model.player1)
            return {message:'Player 1 is required'};

        return null;
    }

    if(! model)
    {
        callback({error:{message:'Model is required!'}});
        return;
    }

    var error = validateModel();

    if(error)
    {
        callback({error: error});
        return;
    }

    dbHelpers.getClient(function(err, client){
        if(hasError(client, err, callback)) return;

        client.collection(collName, function(cerr, coll){
            if(hasError(client, cerr, callback)) return;

            model.createdDate = new Date();

            coll.insert(model, {safe:true}, function(err2, docs){
                if(hasError(client, err2, callback)) return;
                client.close();
                callback({doc: docs[0]});
            });
        });
    });
};

/**
 * get game information by its id
 * @param {ObjectId} id
 * @param {function} callback
 */
exports.getById = function(id, callback){
    var gameId = id;

    if(typeof gameId == 'string')
        gameId = typeConverter.fromString.toObjectId(gameId);

    if(! gameId)
        callback();


    dbHelpers.getClient(function(err, client){
        if(hasError(client, err, callback)) return;

        client.collection(collName, function(cerr, coll){
            if(hasError(client, cerr, callback)) return;

            coll.findOne({_id: id}, function(err,doc){
                client.close();
                callback({err: err, doc: doc});
            });

        });
    });

};