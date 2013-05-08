var dbHelpers = require('../utils/dbHelpers');

var collName = 'Account';

function hasError(client, err, callback){
    if(err){
        client.close();
        callback({error: err});
        return true;
    }
    return false;
}


/**
 * Creates a new account
 * @param {Object} model
 * @param {function} callback
 */
exports.create = function(model, callback){
    if(! model || !model.name)
    {
        callback({error:{message:'Name is required!'}});
        return;
    }

    dbHelpers.getClient(function(err, client){
        if(hasError(client, err, callback)) return;

        client.collection(collName, function(cerr, coll){
            if(hasError(client, cerr, callback)) return;

            coll.findOne({name : model.name }, function(err1, doc){
                if(hasError(client, err1, callback)) return;
                if(doc){
                    client.close();
                    callback({error: {message:'Duplicate id'}});
                    return;
                }

                model.createdDate = new Date();

                coll.insert(model, {safe:true}, function(err2, docs){
                    if(hasError(client, err2, callback)) return;
                    client.close();
                    callback({doc: docs[0]});
                });
            })
        });
    });
};



/**
 * Deletes an account by its id
 * @param {string} name  account name
 * @param {function} callback
 */
exports.delete = function(name, callback){
    dbHelpers.getClient(function(err, client){
        if(hasError(client, err, callback)) return;

        client.collection(collName, function(cerr, coll){
            if(hasError(client, cerr, callback)) return;

            coll.remove({name: name}, {safe: true}, function(err2, result){
                if(hasError(client, err2, callback)) return;
                client.close();
                callback({});
            });
        });

    });
};





