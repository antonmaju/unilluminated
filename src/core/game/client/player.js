module.exports = (function(){

    var GameUtils = require('../commonUtils');
    var Directions = require('../playerDirections');
    var AreaTypes = require('../areaTypes');
    var event = require('events');
    var PlayerModes = require('./playerMode');


    function Player(options){
        event.EventEmitter.call(this);

        var defaults = {
            widthSize: 1,
            heightSize: 1,
            interval:100,
            imageKeys:{},
            velocity: 0,
            row:0,
            column:0,
            mapRenderer: null,
            maxCountdown :10,
            maxWanderCountdown : 15000,
            sightRadius: 10,
            pathFindingInterval : 3000
        };

        this.playerId = (options.playerId)? options.playerId : null;

        this.options = GameUtils.extends({}, defaults, options);
        this._activeDirection = Directions.Right;
        this._reachExit =false;

        this._init();
    }

    Player.prototype = Object.create(event.EventEmitter.prototype);

    Player.prototype.isAuto = function(){
        return this.playerId == null;
    }

    Player.prototype.move =function(direction){

        this._activeDirection = direction;

        var newRow = this.options.row;
        var newColumn = this.options.column;

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

        if(this._canWalk(newRow, newColumn))
        {
            this.options.row = newRow;
            this.options.column = newColumn;
        }
    };

    Player.prototype.getRow = function(){
        return this.options.row;
    };

    Player.prototype.getColumn= function(){
        return this.options.column;
    };

    Player.prototype.getWidthSize= function(){
        return this.options.widthSize;
    };

    Player.prototype.getHeightSize = function(){
        return this.options.heightSize;
    };

    Player.prototype.paint= function(time){
        this.emit('beforePaint', time);

        var gridSize = this.options.mapRenderer.gridSize;
        var curRow = this.options.row - this.options.mapRenderer._startRow;
        var curColumn = this.options.column - this.options.mapRenderer._startColumn;
        var context = this.options.context;
        var canvas = context.canvas;

        var img = this.options.imageManager.get(this.options.imageKeys[this._activeDirection]);

        context.drawImage(img, curColumn * gridSize,
            curRow * gridSize, this.getWidthSize() *gridSize,
            this.getHeightSize() * gridSize);

        this.emit('afterPaint', time);
    };


    Player.prototype._canWalk = function(newRow, newColumn){
        var widthDiff = this.options.widthSize-1;
        var heightDiff = this.options.heightSize-1;

        if(newRow < 0 || (newRow+heightDiff) >= this.options.mapRenderer._totalRow ||
            newColumn <0 || (newColumn+heightDiff) >= this.options.mapRenderer._totalColumn)
            return false;

        var walkable = true;
        for(var i=newRow; i<=newRow+heightDiff; i++)
        {
            for(var j=newColumn; j<=newColumn+widthDiff; j++)
            {
                areaType = AreaTypes[this.options.map.grid[i][j]];
                if(! areaType.isWalkable)
                {
                    walkable = false;
                    break;
                }
            }
        }
        return walkable;

    };

    Player.prototype._init = function(){


    };


    return Player;
})();