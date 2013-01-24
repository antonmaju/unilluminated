var config = require('../config'),
    mongo = require('mongodb');

/**
 * Get mongodb client
 * @param {function} callback.
 */
exports.getClient = function(callback){
    var client = new mongo.Db(config.mongoDatabase, new mongo.Server(config.mongoServer,config.mongoPort,{}), {safe: true});

    client.open(function(err, p_client){
        if(err)
        {
            callback(err, null);
            return;
        }
        if(config.mongoUser && config.mongoPassword)
        {
            client.authenticate(config.mongoUser, config.mongoPassword, function(err2) {
                callback(err2, client);
            });
        }
        else
        {
            callback(null, client);
        }
    });
}