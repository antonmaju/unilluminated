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
            callback({err: err0});
            return;
        }

        client.collection(collName, function(cerr, coll){
            coll.remove({},{safe:true},function(err, result){
                callback();
            });
        });
    });
}
