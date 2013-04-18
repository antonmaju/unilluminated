module.exports = (function(){

    var GameUtils = require('../commonUtils'),
        PlayerDirections = require('../playerDirections'),
        AreaTypes = require('../areaTypes'),
        astar = require('./astar'),
        event = require('events');

    function WanderBehavior(options){
        event.EventEmitter.call(this);

        var defaults = {
            sightRadius:10,
            isSingleMap:true,
            widthSize:1,
            heightSize:1
        };

        this.options = GameUtils.extends({}, defaults, options);

        this._path = [];
        this._pathIndex =0;

        if(typeof(Modernizr) != "undefined" &&  Modernizr.webworkers)
            this._worker = new Worker(settings.assetsUrl + '/js/astarWorker.min.js');

        this._init();
    }

    WanderBehavior.prototype = Object.create(event.EventEmitter.prototype);

    WanderBehavior.prototype.setMap = function(map){
        this._map = map;
        this.reset();
    };

    WanderBehavior.prototype.setPosition= function(pos){
        this._position = pos;
    };

    WanderBehavior.prototype.getPosition = function(){
        return this._position;
    };

    WanderBehavior.prototype.isSingleMap= function(){
        return this.options.isSingleMap;
    };

    WanderBehavior.prototype._generatePath= function(){
        this._pathIndex =0;

        var target = this._findNewTarget();


        if(this._worker)
        {
            this._worker.postMessage({
                grid:  this._map.grid,
                start: this._position,
                end: target,
                widthSize: this.options.widthSize,
                heightSize: this.options.heightSize
            });

            return;
        }

        this._path = astar(this._map.grid, this._position, target, this.options.widthSize, this.options.heightSize) || [];
        this.emit('_pathGenerated');
    };

    WanderBehavior.prototype._findNewTarget = function(){
        var target;

        if(this.isSingleMap()){
            target = this._findNearbySingleMapTarget();
        }
        else{
            target = this._findNearbyMultiMapTarget();
        }

        return target;
    };

    WanderBehavior.prototype._mapDirection =function(pos){
        switch(pos){
            case 0:
                return PlayerDirections.Top;
            case 1:
                return PlayerDirections.Bottom;
            case 2:
                return PlayerDirections.Left;
            default:
                return PlayerDirections.Right;
        }
    };

    WanderBehavior.prototype.getMap = function(){
        return this._map;
    };

    WanderBehavior.prototype._findNearbySingleMapTarget = function(){

        var halfSight = Math.floor(this.options.sightRadius / 2);
        var totalRow = this._map.grid.length;
        var totalColumn = this._map.grid[0].length;

        var target = null;

        do{
            var randValue = Math.floor(Math.random()*4);
            var direction = this._mapDirection(randValue);
            var topMost, bottomMost, leftMost, rightMost;

            switch(direction){
                case PlayerDirections.Top:
                    topMost = this._position.row - this.options.sightRadius;
                    if(topMost < 0)
                        topMost =0;
                    bottomMost = this._position.row;
                    leftMost = this._position.column - halfSight;
                    if(leftMost < 0)
                        leftMost =0;
                    rightMost = this._position.column + halfSight;
                    if(rightMost >= totalColumn)
                        rightMost = totalColumn -1;
                    for(var i= topMost; i<= bottomMost; i++)
                    {
                        for(var j=leftMost; j<= rightMost; j++)
                        {
                            if(GameUtils.isWalkableArea(this._map.grid, i, j,
                                this.options.widthSize, this.options.heightSize) && areaType != '27')
                            {
                                target = {row: i, column: j};
                                break;
                            }
                        }
                        if(target) break;
                    }
                    break;
                case PlayerDirections.Right:
                    topMost =  this._position.row - halfSight;
                    if(topMost < 0)
                        topMost = 0;
                    bottomMost = this._position.row + halfSight;
                    if(bottomMost >= totalRow)
                        bottomMost= totalRow -1;
                    leftMost = this._position.column;
                    rightMost = this._position.column + this.options.sightRadius;
                    if(rightMost >= totalColumn)
                        rightMost =totalColumn-1;
                    for(var i= topMost; i<= bottomMost; i++)
                    {
                        for(var j=rightMost; j>= leftMost; j--)
                        {
                            var areaType = AreaTypes[this._map.grid[i][j]];
                            if(areaType.isWalkable && areaType != '27')
                            {
                                target = {row: i, column: j};
                                break;
                            }
                        }
                        if(target) break;
                    }
                    break;
                case PlayerDirections.Bottom:
                    topMost =  this._position.row;
                    bottomMost = this._position.row + this.options.sightRadius;
                    if(bottomMost >= totalRow)
                        bottomMost= totalRow -1;
                    leftMost = this._position.column - halfSight;
                    if(leftMost < 0)
                        leftMost =0;
                    rightMost = this._position.column + this.options.sightRadius;
                    if(rightMost >= totalColumn)
                        rightMost =totalColumn-1;
                    for(var i= bottomMost; i>= topMost; i--)
                    {
                        for(var j=leftMost; j<= rightMost; j++)
                        {
                            var areaType = AreaTypes[this._map.grid[i][j]];
                            if(areaType.isWalkable && areaType != '27')
                            {
                                target = {row: i, column: j};
                                break;
                            }
                        }
                        if(target) break;
                    }
                    break;
                case PlayerDirections.Left:
                    topMost =  this._position.row - halfSight;
                    if(topMost < 0)
                        topMost = 0;
                    bottomMost = this._position.row + halfSight;
                    if(bottomMost >= totalRow)
                        bottomMost= totalRow -1;
                    rightMost = this._position.column;
                    leftMost = this._position.column - this.options.sightRadius;
                    if(leftMost < 0)
                        leftMost = 0;
                    for(var i= bottomMost; i>= topMost; i--)
                    {
                        for(var j=leftMost; j<= rightMost; j++)
                        {
                            var areaType = AreaTypes[this._map.grid[i][j]];
                            if(areaType.isWalkable && areaType != '27')
                            {
                                target = {row: i, column: j};
                                break;
                            }
                        }
                    }

                    break;
            }
        }while(target == null);

        return target;

    };

    WanderBehavior.prototype._findNearbyMultiMapTarget = function(){

    };

    WanderBehavior.prototype.getNextMove = function(){

        if(this._pathIndex >= this._path.length)
        {
            this._generatePath();
        }
        else
        {
            this.emit('_pathGenerated');
        }
    };

    WanderBehavior.prototype._init = function(){
        var self = this;

        self.on('_pathGenerated', function(){
            var nextMove = null;
            if(this._pathIndex <  this._path.length)
            {
                nextMove = this._path[this._pathIndex];
                this._position = nextMove;
                this._pathIndex++;
            }
            else
            {
                nextMove = this._position;
            }
            self.emit('nextMoveGenerated', nextMove);
        });

        if(this._worker)
        {
            this._worker.onmessage = function(evt){
                self._path = evt.data || [];
                self.emit('_pathGenerated');
            };
        }
    };

    WanderBehavior.prototype.reset= function(){
        this._path =[];
        this._pathIndex=0;
    };

    return WanderBehavior;

})();