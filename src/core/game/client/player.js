module.exports = (function(){

    var GameUtils = require('../commonUtils');
    var Directions = require('../playerDirections');
    var AreaTypes = require('../areaTypes');
    var ImageSource = require('../imageSource');
    var event = require('events');
    var PlayerModes = require('./playerMode');
    var FilterManager = require('./filterManager');
    /**
     * This class encapsulates player information
     * @param {object} options
     * @constructor
     */
    function Player(options){
        event.EventEmitter.call(this);

        var defaults = {
            widthSize: 1,
            heightSize: 1,
            interval:100,
            imageKeys:{},
            velocity: 0,
            mapRenderer: null,
            maxCountdown :10,
            maxWanderCountdown : 15000,
            sightRadius: 10,
            pathFindingInterval : 3000
        };

        this.playerId = (options.playerId)? options.playerId : null;

        this.options = GameUtils.extends({}, defaults, options);
        this._activeDirection = Directions.Right;

        this.row = 0;
        this.column = 0;

        this._init();
    }

    Player.prototype = Object.create(event.EventEmitter.prototype);

    Player.prototype.isAuto = function(){
        return this.playerId == null;
    };

    /**
     * Moves player to new position based on direction
     * @param {int} direction
     */
    Player.prototype.move =function(direction){

        this._activeDirection = direction;

        var newRow = this.row;
        var newColumn = this.column;

        switch(this._activeDirection)
        {
            case Directions.Top:
                newRow--;
                break;

            case Directions.Left:
                newColumn--;
                break;

            case Directions.Right:
                newColumn++;
                break;

            case Directions.Bottom:
                newRow ++;
                break;
        }

        if(this.canWalk(newRow, newColumn))
        {
            this.row = newRow;
            this.column = newColumn;
        }
    };

    /**
     * Sets player direction
     * @param {int} direction
     */
    Player.prototype.setDirection = function(direction){
        this._activeDirection = direction;
    };
    /**
     * set filter for player
     * @param filter
     */
    Player.prototype.setFilter = function(filter){
        var playerFilter  =  require('./filters/filterBase');
        if(filter != 'none' )
        {
            playerFilter  =  require('./filters/'+ filter +'Filter');
        }
        this.playerFilter = new playerFilter();

    };

    /**
     * Sets player direction based on position
     * @param {int} row
     * @param {int} column
     */
    Player.prototype.setDirectionBasedOnPosition = function(row, column){
        if(row > this.row)
            this._activeDirection = Directions.Bottom;
        else if(row < this.row)
            this._activeDirection = Directions.Top;
        else if(column > this.column)
            this._activeDirection = Directions.Right;
        else if(column < this.column)
            this._activeDirection = Directions.Left;
    };

    /**
     * Gets player type
     * @returns {int}
     */
    Player.prototype.getType = function(){
        return this.options.playerType;
    };

    /**
     * Gets player width size
     * @returns {int}
     */
    Player.prototype.getWidthSize= function(){
        return this.options.widthSize;
    };

    /**
     * Gets player height size
     * @returns {int}
     */
    Player.prototype.getHeightSize = function(){
        return this.options.heightSize;
    };

    /**
     * Gets player sight radius
     * @returns {int}
     */
    Player.prototype.getSightRadius = function(){
        return this.options.sightRadius;
    };

    /**
     * Sets player position
     * @param {int} row
     * @param {int} column
     */
    Player.prototype.setPosition = function(row, column){
        this.row = row;
        this.column = column;
    };

    /**
     * Sets map
     * @param {object} map
     */
    Player.prototype.setMap = function(map){
        this.map = map;
    };

    /**
     * Draws current player
     * @param {int} time
     */
    Player.prototype.paint= function(time){

        if(this.mode == PlayerModes.Hide)
        {
            var diff = Math.ceil((time - this._lastHideTime)/1000);
            this._currentCountdown = this.options.maxCountdown - diff;
            if(this._currentCountdown < 0)
                this._currentCountdown = 0;
        }
        if(this.mode == PlayerModes.Hide && this._currentCountdown == 0)
        {
            this.toggleHide();
            return;
        }

        this.emit('beforePaint', time);

        var gridSize = this.options.mapRenderer.gridSize;
        var curRow = this.row - this.options.mapRenderer._startRow;
        var curColumn = this.column - this.options.mapRenderer._startColumn;
        var context = this.options.context;
        var canvas = context.canvas;


        var imgSource = ImageSource[this.options.imageKeys[this._activeDirection]];


        if(this.mode == PlayerModes.Hide )
        {
            imgSource = ImageSource[this.options.camouflageKey];

            if(! this._hideCanvas)
            {
                this._hideCanvas = document.createElement('canvas');
                this._hideCanvas.width = this.getWidthSize() *gridSize;
                this._hideCanvas.height = this.getHeightSize() * gridSize;
                this._hideContext = this._hideCanvas.getContext('2d');

                var hideImg = this.options.imageManager.get(imgSource.src);
                this._hideContext.drawImage(hideImg,0, imgSource.top, imgSource.width, imgSource.height,
                    0,0,this._hideCanvas.width,this._hideCanvas.height);


                this.setFilter(this.map.filter);
                this.playerFilter.applyFilterForPlayer({
                    context : this._hideContext
                });

            }


            context.drawImage(this._hideCanvas,
                0, 0, this._hideCanvas.width, this._hideCanvas.height,
                curColumn * gridSize,curRow * gridSize,
                this.getWidthSize() *gridSize,this.getHeightSize() * gridSize);
        }
        else{
            var img = this.options.imageManager.get(imgSource.src);

            context.drawImage(img,
                0, imgSource.top, imgSource.width, imgSource.height,
                curColumn * gridSize,curRow * gridSize,
                this.getWidthSize() *gridSize,this.getHeightSize() * gridSize);
        }



        this.emit('afterPaint', time);
    };

    /**
     * Checks whether player can walk to new position
     * @param {int} newRow
     * @param {int} newColumn
     * @returns {boolean}
     */
    Player.prototype.canWalk = function(newRow, newColumn){
        var widthDiff = this.options.widthSize-1;
        var heightDiff = this.options.heightSize-1;

        var totalRow = this.map.grid.length;
        var totalColumn = this.map.grid[0].length;

        if(newRow < 0 || (newRow+heightDiff) >= totalRow ||
            newColumn <0 || (newColumn+heightDiff) >= totalColumn)
            return false;

        var walkable = true;
        for(var i=newRow; i<=newRow+heightDiff; i++)
        {
            for(var j=newColumn; j<=newColumn+widthDiff; j++)
            {
                var areaType = AreaTypes[this.map.grid[i][j]];
                if(! areaType.isWalkable)
                {
                    walkable = false;
                    break;
                }
            }
        }
        if(this.mode == PlayerModes.Hide )
        {
            walkable = false;
        }
        return walkable;

    };

    Player.prototype._init = function(){
        this.on('afterPaint', function(){
           this._checkPostCondition();
        });
    };

    Player.prototype._checkPostCondition = function(){
        var areaType = this.map.grid[this.row][this.column];

        if(areaType == '27' && this._hasMove && !this.options.isSingleMap){
            var direction = this._getExitDirection();
            if(direction){
                this.emit('movingToNewArea', direction);
            }

        }else if(areaType != '27'){
            this._hasMove = true;
        }

    };

    /**
     * Gets current occupied positions
     * @returns {Array}
     */
    Player.prototype.getOccupiedPositions = function(){
        var posList =[];

        for(var i=this.row; i<this.row+this.getHeightSize(); i++)
        {
            for(var j= this.column; j< this.column+this.getWidthSize(); j++)
            {
                posList.push({row:i, column:j});
            }
        }

        return posList;
    };

    /**
     * Determines if this player collides with specified player instance
     * @param {object} player
     * @returns {boolean}
     */
    Player.prototype.collidesWith = function(player){
        var ownPos = this.getOccupiedPositions();
        var otherPos = player.getOccupiedPositions();

        for(var i=0; i< ownPos.length; i++)
        {
            for(var j=0; j< otherPos.length; j++)
            {
                if(ownPos[i].row == otherPos[j].row && ownPos[i].column == otherPos[j].column)
                    return true;
            }
        }

        return false;
    };

    /**
     * Determines if this player is on specific area
     * @param {string} areaId
     * @returns {boolean}
     */
    Player.prototype.isOnArea = function(areaId){
        var ownPos = this.getOccupiedPositions();
        for(var i=0; i<ownPos.length; i++)
        {
            var pos = ownPos[i];
            if(this.map.grid[pos.row][pos.column] == areaId)
                return true;
        }

        return false;
    };

    Player.prototype._getExitDirection = function(){
        var direction = null;

        for(var exitProp in this.map.exits){
            var exitInfo = this.map.exits[exitProp];
            for(var i=0; i< exitInfo.length; i++){
                if(exitInfo[i].row == this.row && exitInfo[i].column == this.column){
                    direction = exitProp;
                    break;
                }
            }
        }

        return direction;
    };

    /**
     * Switch player modes to hide or wander
     */
    Player.prototype.toggleHide = function(){

        if(this.mode == PlayerModes.Hide )
        {
            this.mode = PlayerModes.Wander;
        }
        else
        {
            this.mode = PlayerModes.Hide;
            this._lastHideTime = + new Date;
            this._currentCountdown = this.options.maxCountdown;
        }
       // alert(this.mode);

    };

    Player.prototype.destroy = function(){
        this.removeAllListeners();
        this._hideCanvas = null;
    };

    return Player;
})();