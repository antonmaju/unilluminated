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

/**
 * Creates new Game document
 * @param {Object} model
 * @param {function} callback
 */
exports.create = function(model, callback){
    function validateModel(){
        if(! model.mode)
            return {message:'Mode is required'};

        if(! model.players || (! model.players.girl && ! model.players.guardian))
            return {message:'Player is required'};

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
 * Saves changes of a Game document
 * @param {Object} model
 * @param {function} callback
 */
exports.save = function(model, callback){
    function validateModel(){
        if(! model._id)
            return {message:'id is required'};

        if(! model.mode)
            return {message:'Mode is required'};

        if(! model.players || (! model.players.girl && ! model.players.guardian))
            return {message:'Player is required'};

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

            coll.update({_id: model._id}, model, {safe:true, upsert:true}, function(err2, count){

                if(hasError(client, err2, callback)) return;
                client.close();
                callback({count: count});
            });
        });
    });
};

/**
 * Gets game information by its id
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

            coll.findOne({_id: gameId}, function(err,doc){
                client.close();
                callback({error: err, doc: doc});
            });

        });
    });

};