var Game = require('../game'),
    LoadingView = require('./views/loadingView'),
    MapView = require('./views/mapView'),
    AssetFiles = require('../assetFiles'),
    imageSource = require('../imageSource'),
    playerFactory = require('./playerFactory'),
    Directions = require('../playerDirections'),
    PlayerActions = require('../playerActions'),
    PlayerTypes = require('../playerTypes'),
    WanderBehavior = require('./wanderBehavior'),
    GuardianBehavior = require('./guardianBehavior'),
    PlayerMode = require('./playerMode'),
    AudioManager = require('./audioManager'),
    FilterManager = require('./filterManager'),
    ImageManager = require('./imageManager'),
    MapRenderer = require('./mapRenderer'),
    ViewManager = require('./viewManager'),
    InputBuffer = require('./inputBuffer');

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini|Opera Mobi/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


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

Game.prototype._initDependencies = function(){
    this._filterManager = new FilterManager();
    this._imageManager = new ImageManager();
    this._viewManager = new ViewManager();

    this._mapRenderer = new MapRenderer({
        filterManager: this._filterManager,
        imageManager: this._imageManager,
        context : this.options.context
    });

};

Game.prototype._initFilters = function(){
    this._filterManager.register('none', require('./filters/filterBase'));
    this._filterManager.register('dark', require('./filters/darkFilter'));
    this._filterManager.register('darkCircle', require('./filters/darkCircleFilter'));
    this._filterManager.set('none');
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

    function initMobileButtons(){


        $('#btnContainerAll').show().css('position','absolute')
            .css('display','block');
        $('#btnContainerRight').show().css('position','absolute')
            .css('display','block');

        $('#btnAct')
            .click(function(evt){
                console.log("action");
            });

        $('#btnDirectionUp')
            .click(function(evt){
                self._inputBuffer.addInput(PlayerActions.MoveTop);
            });
        $('#btnDirectionRight')
            .click(function(evt){
                self._inputBuffer.addInput(PlayerActions.MoveRight);
            });
        $('#btnDirectionLeft')
            .click(function(evt){
                self._inputBuffer.addInput(PlayerActions.MoveLeft);
            });
        $('#btnDirectionDown')
            .click(function(evt){
                self._inputBuffer.addInput(PlayerActions.MoveBottom);
            });

    }
    if(isMobile.any())
        initMobileButtons();

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

        this._viewManager.setView('loading');
        this.render(+ new Date);

        function emitResourceRequest(){
            socket.emit('resourceRequest', {
                id: self.options.id,
                userId: self.options.userId
            });
        }

        this._imageManager.download(function(){
            soundManager.setup({
                url:'/soundmanager2/swf/',
                debugMode: false,
                onready: function() {
                    self._audioManager.init();
                    emitResourceRequest();
                },
                ontimeout: function(){
                    self._audioManager.enabled = false;
                    emitResourceRequest();
                }

            });

        });
    });

    self.on('evaluatingSound', function(){
        if(this._chasers <= 0){
            this._audioManager.play('harp');
        } else {
            this._audioManager.play('dissonant');
        }
    });

    socket.on('resourceResponse', function(data){
        self._current = data;
        self._initPlayers();
        self._viewManager.setView('map');
        self._audioManager.play('harp');
    });

    socket.on('movedToNewArea', function(data){
        self._current = data;
        self._initPlayers();
        self._viewManager.setView('map');
    });

    socket.on('gameEnded', function(data){
        document.location.href = '/game/'+self.options.id;
    });

    this._initPlayerHandlers();
};

Game.prototype._initPlayerEvents = function(player){
    var self = this;

    player.on('movingToNewArea', function(direction){
        self._viewManager.setView('loading');
        self.options.socket.emit('movingToNewArea',{
            id: self.options.id,
            userId: player.playerId,
            direction: direction
        });
    });
};

Game.prototype._initViews = function(){
    var mgr = this._viewManager;

    mgr.addView(new LoadingView({
        context: this.options.context
    }));

    mgr.addView(new MapView({
        context: this.options.context,
        mapRenderer: this._mapRenderer
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

    this._chasers = 0;

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
        var positionInfo =(playerInfo.row != null && playerInfo.column != null) ?
            {row: playerInfo.row, column: playerInfo.column} :
            playerMap.exits[playerInfo.direction][0];

        var playerOptions = {
            imageManager: this._imageManager,
            playerType: playerInfo.type,
            row: positionInfo.row,
            column: positionInfo.column,
            mapRenderer: this._mapRenderer,
            context: this.options.context,
            playerId: playerInfo.id,
            isSingleMap: playerInfo.id != self.options.userId //will be changed later
        };

        var player = playerFactory.create(playerOptions);

        player.setPosition(positionInfo.row, positionInfo.column);
        player.setMap(playerMap);

        if(playerInfo.id == self.options.userId)
        {
            this._player = player;
            this._playerType = playerType;
            this._map = playerMap;
            console.log(this._map.filter);
            this._filterManager.set(this._map.filter);
            this._mapRenderer.setPlayer(player);
            this._mapRenderer.setGrid(playerMap.grid);
        }
        else
        {
            if(playerInfo.direction != null)
                player.setDirection(playerInfo.direction);

            player.behavior = new GuardianBehavior({
                widthSize: player.getWidthSize(),
                heightSize:player.getHeightSize()
            });

            player.behavior.setMap(playerMap);
            player.behavior.setPosition({row: positionInfo.row, column: positionInfo.column});

            player.behavior.on('nextMoveGenerated', function(player){

                function handleNextMove(nextPos){
                    player.setDirectionBasedOnPosition(nextPos.row, nextPos.column);
                    player.setPosition(nextPos.row, nextPos.column);
                }

                return handleNextMove;

            }(player));

            player.behavior.on('stateChanged', function(player){

                function handleModeChange(data){
                    if(data.oldState == PlayerMode.Chase)
                        self._chasers --;
                    else if(data.newState == PlayerMode.Chase)
                        self._chasers ++;

                    self.emit('evaluatingSound');
                }

                return handleModeChange;
            }(player));
        }

        this._initPlayerEvents(player);
        this._players.push(player);
    }

    for(var i=0; i<this._players.length; i++)
    {
        var player = this._players[i];
        if(player.behavior)
        {
            if(player.getType() == PlayerTypes.Guardian)
                player.behavior.setEnemy(this._player);
        }
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

    this._audioManager = new AudioManager();
    this._imageManager.queueItems(AssetFiles);
};

Game.prototype._evaluateState = function(){
    if(! this._player) return;
    var socket = this.options.socket;

    for(var i=0; i<this._players.length; i++)
    {
        var player = this._players[i];

        if(this._player.playerId == player.playerId || this._player.map.id != player.map.id) continue;

        if(this._player.getType() == PlayerTypes.Girl)
        {
            if(this._player.collidesWith(player))
            {
                socket.emit('gameOverRequest', {
                    id: this.options.id,
                    userId: this.options.userId,
                    winnerId: player.playerId
                });
                return;
            }
        }
        else if(this._player.getType() == PlayerTypes.Guardian)
        {
            if(player.getType() != PlayerTypes.Girl) continue;

            if(this._player.collidesWith(player))
            {
                socket.emit('gameOverRequest', {
                    id: this.options.id,
                    userId: this.options.userId,
                    winnerId: this._player.playerId
                });
                return;
            }
        }
    }

    if(this._player.isOnArea(5))
    {
        socket.emit('gameOverRequest',  {
            id: this.options.id,
            userId: this._player.playerId,
            winnerId: this._player.playerId
        });
    }
};

Game.prototype.render = function(step){
    time = + new Date;
    var self = this;
    self.fps = self._getFps(time);
    var context = self.options.context;

    if(time - this._lastDrawTime >= this._drawInterval)
    {
        self._filterManager.get().applyPreRenderGame({
            context: context
        });

        self._viewManager.currentView.animate(time);
        if(self._viewManager.currentView.id == 'map')
        {
            for(var i =0; i<self._players.length; i++)
            {
                var player = self._players[i];
                if(player.behavior)
                    player.behavior.getNextMove();

                player.paint(time);
            }
        }

        self._filterManager.get().applyPostRenderGame({
            context: context
        });

        this._lastDrawTime = time;
        this._evaluateState();
    }

    requestNextAnimationFrame(function(tm){self.render(tm);});
};


Game.prototype._init = function()
{
    this._inputInterval = 50;
    this._initDependencies();
    this._initEventHandlers();
    this._initViews();
    this._initFilters();
    this._initAssets();
    this._drawInterval = 150;
    this._lastDrawTime = + new Date;
};

Game.prototype.resize = function(){
    if(this._viewManager.currentView)
        this._viewManager.currentView.resize();
};

module.exports = Game;