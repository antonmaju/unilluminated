
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
    controllerRegistry = require('./controllers/controllerRegistry') ,
    GameEngine = require('./core/game/server/engine'),
    MongoStore = require('./core/utils/mongoStore')(express),
    redis = require('redis'),
    RedisStore = require('connect-redis')(express),
    SocketRedisStore = require('socket.io/lib/stores/redis'),
    config = require('./core/config'),
    nconf = require('nconf');

var app = express();


function getSessionParam(){
    var sessionParam = {secret:nconf.get('sessionSecret')};
    var sessionStoreMode = nconf.get('sessionStore');

    if(sessionStoreMode == 'redis'){
        sessionParam.cookie= {maxAge: 1000 * 7200};
        sessionParam.store = new RedisStore({
            host: config.redisServer,
            port: config.redisPort,
            ttl:3600,
            db : config.redisIndex,
            pass:config.redisPassword
        });
    }
    else if(sessionStoreMode == 'mongo'){
        sessionParam.store = new MongoStore({
            host: config.mongoServer,
            port: config.mongoPort,
            db : config.mongoDatabase,
            user: config.mongoUser,
            password: config.mongoPassword
        });
    }

    return sessionParam;
}

function getRedisClient(){
    var client = redis.createClient(config.redisPort, config.redisServer);

    if(config.redisPassword){
        client.auth(config.redisPassword, function(err){ if (err) throw err;  });
    }

    if(config.redisIndex)
        client.select(config.redisIndex);

    return client;
}

function setSocketIoStore(io){
    var storeMode = nconf.get('socketIoStore');

    if(storeMode != 'redis') return;

    io.set('store',new SocketRedisStore({
        redis: redis,
        redisPub : getRedisClient(),
        redisSub : getRedisClient(),
        redisClient : getRedisClient()
    }));
}

app.configure(function(){
    app.set('port', nconf.get('port') ||   3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true
    }));
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(getSessionParam()));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

require('./core/sideTasks')(app);


app.configure('development', function(){
    app.use(express.errorHandler());
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.configure(function(){
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    setSocketIoStore(io);
});


controllerRegistry.register(app);
GameEngine.start(app, io);


server.listen(app.get('port'), function(){
    console.log(__dirname);
    console.log("Express server listening on port " + app.get('port'));
});

