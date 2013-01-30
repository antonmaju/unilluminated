
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  lessMiddleware = require('less-middleware'),
  controllerRegistry = require('./controllers/controllerRegistry')  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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

app.configure('development', function(){
  app.use(express.errorHandler());
});

controllerRegistry.register(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
