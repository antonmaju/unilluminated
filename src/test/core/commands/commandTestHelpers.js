var coreServices = require('../../../core/coreServices'),
    dbHelpers = coreServices.dbHelpers;


/**
 * Clear mongodb collection
 * @param {string} collName MongoDb collection name
 * @param {function} callback
 */
exports.clear = function(collName, callback){
    dbHelpers.getClient(function(err0, client){
        if(err0){
            client.close();
            callback({err: err0});
            return;
        }

        client.collection(collName, function(cerr, coll){
            coll.remove({},{safe:true},function(err, result){
                client.close();
                callback();
            });
        });
    });
};

/**
 * Create new document
 * @param collName
 * @param model
 * @param callback
 */
exports.create = function(collName, model, callback){
    dbHelpers.getClient(function(err0, client){
        if(err0){
            client.close();
            callback({err: err0});
            return;
        }

        client.collection(collName, function(cerr, coll){
            coll.insert(model, {safe:true}, function(err, docs){
                client.close();
                callback({doc : docs[0]})
            });
        });
    });
};

exports.find = function(collName, query, callback){
    dbHelpers.getClient(function(err0, client){
        if(err0){
            client.close();
            callback({err: err0});
            return;
        }

        client.collection(collName, function(cerr, coll){
            coll.find(query).toArray(function(err, docs){
                client.close();
                callback({docs : docs})
            });
        });
    });
}

