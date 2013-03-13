var mongo = require('mongoDb');

module.exports = function(connect){

    var defaults = {
        host: '127.0.0.1',
        port:  27017,
        db  :  'db',
        collName : 'sessions',
        user : null,
        password: null,
        expire :3600
    };

    var Store = connect.session.Store;

    function merge(){
        var args = arguments;
        if(args.length == 0) return null;
        if(args.length == 1) return args[0];
        var obj1 = args[0];

        for(var i=1; i<args.length; i++){
            var source = args[i];
            for(var prop in source){
                obj1[prop]=source[prop];
            }
        }

        return obj1;
    }

    function getClient(options, callback){
        var client = new mongo.Db(options.db, new mongo.Server(options.host, options.port,{}), {safe: true});
        client.open(function(err, p_client){
            if(err)
            {
                callback(err, null);
                return;
            }
            if(options.user && options.password)
            {
                client.authenticate(options.user, options.password, function(err2) {
                    callback(err2, client);
                });
            }
            else
            {
                callback(null, client);
            }
        });
    }

    function hasError(client, error, callback){
        if(error){
            client.close();

            if(callback){
                callback(error);
                return true;
            }
            else{
                throw error;
            }
        }
        return false;
    }


    function MongoStore(options){

        this.options = merge({}, defaults, options);

        var self = this;

        getClient(self.options, function(err, client){
            hasError(client, err);

            client.collection(self.options.collName, function(cerr, coll){
                hasError(client, cerr);

                coll.ensureIndex({created : 1}, {expireAfterSeconds:self.options.expire, safe:true}, function(err2, result){
                    client.close();
                });
            });
        });

    }

    MongoStore.prototype.__proto__ = Store.prototype;

    MongoStore.prototype.get = function(sessionId, callback){

        var self = this;

        getClient(self.options, function(err, client){
            if (hasError(client, err, callback)) return;

            client.collection(self.options.collName, function(cerr, coll){
                if (hasError(client, cerr, callback)) return;

                coll.findOne({_id: sessionId}, function(derr, doc){
                    if (hasError(client, derr, callback)) return;
                    client.close();
                    if(! doc)
                        callback && callback();
                    else
                        callback && callback(null, doc.data);
                });
            });
        });
    };

    MongoStore.prototype.set = function(sessionId, session, callback){
        var self = this;

        getClient(self.options, function(err, client){
            if (hasError(client, err, callback)) return;

            client.collection(self.options.collName, function(cerr, coll){
                if (hasError(client, cerr, callback)) return;

                var sessionData = {_id:sessionId, data: session, created: new Date() };

                coll.update({_id:sessionId}, sessionData, {upsert:true}, function(uerr, data){
                    client.close();
                    if(uerr){
                        callback && callback(uerr);
                    }else{
                        callback && callback(null, true);
                    }

                });
            });
        });
    };


    MongoStore.prototype.destroy = function(sessionId, callback){
        var self = this;

        getClient(self.options, function(err, client){
            if (hasError(client, err, callback)) return;

            client.collection(self.options.collName, function(cerr, coll){
                if (hasError(client, cerr, callback)) return;

                coll.remove({_id:sessionId}, {}, function(derr, number){
                    client.close();

                    if(derr)
                        callback && callback(derr);
                    else
                        callback && callback(null, true);
                });
            });
        });

    };


    return MongoStore;

};
