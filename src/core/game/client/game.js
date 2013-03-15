var Game = require('../game'),
    LoadingView = require('./views/loadingView'),
    MapView = require('./views/mapView'),
    AssetFiles = require('../assetFiles'),
    imageSource = require('../imageSource'),
    playerFactory = require('./playerFactory'),
    Directions = require('../playerDirections');

Game.prototype._initInternalCanvas = function(){
    this._internalCanvas = document.createElement('canvas');
    this._internalContext = this._internalCanvas.getContext('2d');
    var canvas = this.options.context.canvas;
    this._internalCanvas.width = canvas.width;
    this._internalCanvas.height = canvas.width;
};

Game.prototype._initDOMEventHandlers = function(){
    var self = this;
    var socket = this.options.socket;

    $(document).on('keydown', function(event){
        self.emit('keydown', event);
    });

};

Game.prototype._initSinglePlayerHandlers = function(){
    var self = this;

    this.on('keydown', function(evt){
        switch(evt.keyCode)
        {
            case 39:
                self._player.move(Directions.Right);
                break;
            case 40:
                self._player.move(Directions.Bottom);
                break;
            case 37:
                self._player.move(Directions.Left);
                break;
            case 38:
                self._player.move(Directions.Top);
                break;
        }
    });
};


Game.prototype._initEventHandlers = function(){
    var socket = this.options.socket;
    var self = this;

    this._initDOMEventHandlers();

    this.on('initializing', function(data){

        this.options.viewManager.setView('loading');
        this.render(+ new Date);

        this.options.imageManager.download(function(){

            socket.emit('resourceRequest', {
                id: self.options.id,
                userId: self.options.userId
            });
        });

    });

    socket.on('resourceResponse', function(data){
        self._current = data;
        self._activeMap = data.player.mapInfo;
        self._initPlayers();

        self.options.mapRenderer.setInternalContext(self._internalContext);
        self.options.mapRenderer.setGrid(self._activeMap.grid);
        self.options.viewManager.setView('map');
    });

    this._initSinglePlayerHandlers();

};

Game.prototype._initViews = function(){
    var mgr = this.options.viewManager;

    mgr.addView(new LoadingView({
        context: this.options.context
    }));

    mgr.addView(new MapView({
        context: this.options.context,
        mapRenderer: this.options.mapRenderer
    }));
};

Game.prototype._initPlayers = function(){
    var startInfo = this._activeMap.exits[this._current.player.direction][0];

    this._player = playerFactory.create({
        imageManager: this.options.imageManager,
        playerType: this._current.player.type,
        row: startInfo.row,
        column: startInfo.column,
        mapRenderer: this.options.mapRenderer,
        context: this.options.context,
        playerId: this.options.userId
    });

    this._player.setPosition(startInfo.row, startInfo.column);
    this._player.setMap(this._activeMap);

    this.options.mapRenderer.setPlayer(this._player);
};


/***
 * Get current fps
 * @param time current timestamp
 * @return {Number} fps number
 */
Game.prototype._getFps = function(time){
    var fps =0;
    if(this._lastFpsTime)
        fps = 1000/ (time - this._lastFpsTime);
    this._lastFpsTime = time;
    return fps;

};


Game.prototype._initAssets = function(){
    this.options.imageManager.queueItems(AssetFiles);
};

Game.prototype.render = function(step){
    time = + new Date;
    var self = this;
    self.fps = self._getFps(time);
    var context = self.options.context;
    if(time - this._lastDrawTime >= this._drawInterval)
    {
        self.options.viewManager.currentView.animate(time);
        if(self.options.viewManager.currentView.id == 'map')
        {
            if(self._player)
            {
                self._player.paint(time);
            }
        }
        this._lastDrawTime = time;
    }

    requestNextAnimationFrame(function(tm){self.render(tm);});
};

Game.prototype._init = function()
{
    this._initInternalCanvas();
    this._initEventHandlers();
    this._initViews();
    this._initAssets();
    this._drawInterval = 150;
    this._lastDrawTime = + new Date;


};

Game.prototype.resize = function(){
    if(this.options.viewManager.currentView)
        this.options.viewManager.currentView.resize();

    if(this._internalCanvas)
    {
        var canvas = this.options.context.canvas;
        this._internalCanvas.width = canvas.width;
        this._internalCanvas.height= canvas.height;
    }

};

module.exports = Game;