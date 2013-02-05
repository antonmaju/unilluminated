
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
    controllerRegistry = require('./controllers/controllerRegistry') ,
    GameEngine = require('./core/game/server/engine'),
    argv = require('optimist').argv;

var app = express();

app.configure(function(){
    app.set('port', argv.port || process.env.PORT ||   3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true
    }));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret:'test'}));
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

controllerRegistry.register(app);
GameEngine.start(app, io);


server.listen(app.get('port'), function(){
    console.log(__dirname);
    console.log("Express server listening on port " + app.get('port'));
});

