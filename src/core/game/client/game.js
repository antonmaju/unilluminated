var Game = require('../game'),
    LoadingView = require('./views/loadingView'),
    MapView = require('./views/mapView'),
    AssetFiles = require('../assetFiles'),
    imageSource = require('../imageSource'),
    playerFactory = require('./playerFactory'),
    Directions = require('../playerDirections'),
    PlayerActions = require('../playerActions'),
    InputBuffer = require('./inputBuffer');

function getOppositeDirection(direction){
    switch(direction){
        case Directions.Top:
            return Directions.Bottom;
        case Directions.Left:
            return Directions.Right;
        case Directions.Right:
            return Directions.Left;
        case Directions.Bottom:
            return Directions.Top;
    }
}


Game.prototype._initDOMEventHandlers = function(){
    var self = this;
    var socket = this.options.socket;

    $(document).on('keydown', function(event){
        self.emit('keydown', event);
    });

};

Game.prototype._initSinglePlayerHandlers = function(){
    var self = this;
    this._inputBuffer.on('inputPublished', function(action){
        switch(action)
        {
            case PlayerActions.MoveLeft:
                self._player.move(Directions.Left);
                break;
            case PlayerActions.MoveRight:
                self._player.move(Directions.Right);
                break;
            case PlayerActions.MoveTop:
                self._player.move(Directions.Top);
                break;
            case PlayerActions.MoveBottom:
                self._player.move(Directions.Bottom);
                break;
        }
    });
};

Game.prototype._initMultiPlayerHandlers = function(){

};

Game.prototype._initPlayerHandlers = function(){
    var self = this;
    var prevKey = null;
    var lastTime = + new Date;

    this.on('keydown', function(evt){

        var curTime = + new Date;

        if(evt.keyCode == prevKey){
            if((curTime - lastTime) < self._inputInterval) return;
        }

        switch(evt.keyCode)
        {
            case 39:
                self._inputBuffer.addInput(PlayerActions.MoveRight);
                break;
            case 40:
                self._inputBuffer.addInput(PlayerActions.MoveBottom);
                break;
            case 37:
                self._inputBuffer.addInput(PlayerActions.MoveLeft);
                break;
            case 38:
                self._inputBuffer.addInput(PlayerActions.MoveTop);
                break;
        }

        prevKey = evt.keyCode;
        lastTime = curTime;
    });

    (self.options.mode == '1p') ? this._initSinglePlayerHandlers() : this._initMultiPlayerHandlers();
};




Game.prototype._initEventHandlers = function(){
    var socket = this.options.socket;
    var self = this;

    this._inputBuffer = new InputBuffer(this._inputInterval);


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
        self._initPlayers();
        self.options.viewManager.setView('map');
    });

    socket.on('movedToNewArea', function(data){
        self._current = data;
        self._initPlayers();
        self.options.viewManager.setView('map');
    });

    this._initPlayerHandlers();

};

Game.prototype._initPlayerEvents = function(player){
    var self = this;
    player.on('movingToNewArea', function(direction){
        self.options.viewManager.setView('loading');
        self.options.socket.emit('movingToNewArea',{
            id: self.options.id,
            userId: player.playerId,
            direction: direction
        });
    });
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
    var self = this;
    var playersInfo = this._current.players;

    if(this._players){
        for(var i=0; i< this._players.length; i++){
            this._players[i].destroy();
        }
    }

    this._players =[];
    this._maps = this._current.maps;
    this._player = null;
    this._playerType = null;
    this._map = null;


    for(var playerType in playersInfo)
    {
        var playerInfo = playersInfo[playerType];
        var playerMap = this._current.maps[playerType];
        if(!playerMap)
        {
            for(var mapType in this._current.maps)
            {
                if(this._current.maps[mapType].id == playerInfo.map)
                {
                    playerMap = this._current.maps[mapType];
                    break;
                }
            }
        }
        var positionInfo = playerMap.exits[playerInfo.direction][0];

        var player = playerFactory.create({
            imageManager: this.options.imageManager,
            playerType: playerInfo.type,
            row: positionInfo.row,
            column: positionInfo.column,
            mapRenderer: this.options.mapRenderer,
            context: this.options.context,
            playerId: playerInfo.id
        });

        player.setPosition(positionInfo.row, positionInfo.column);
        player.setMap(playerMap);

        if(playerInfo.id == self.options.userId)
        {
            this._player = player;
            this._playerType = playerType;
            this._map = playerMap;
            this.options.mapRenderer.setPlayer(player);
            this.options.mapRenderer.setGrid(playerMap.grid);

        }
        else
        {
            //set AI
        }

        this._initPlayerEvents(player);
        this._players.push(player);
    }
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
            for(var i =0; i<self._players.length; i++)
            {
                var player = self._players[i];
                player.paint(time);
            }

        }
        this._lastDrawTime = time;
    }

    requestNextAnimationFrame(function(tm){self.render(tm);});
};

Game.prototype._init = function()
{
    this._inputInterval = 50;
    this._initEventHandlers();
    this._initViews();
    this._initAssets();
    this._drawInterval = 150;
    this._lastDrawTime = + new Date;
};

Game.prototype.resize = function(){
    if(this.options.viewManager.currentView)
        this.options.viewManager.currentView.resize();
};

module.exports = Game;