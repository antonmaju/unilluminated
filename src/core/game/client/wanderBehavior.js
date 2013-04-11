module.exports = (function(){

    var GameUtils = require('../commonUtils'),
        PlayerDirections = require('../playerDirections'),
        AreaTypes = require('../areaTypes'),
        commonUtils = require('../commonUtils'),
        astar = require('./astar');

    function WanderBehavior(options){

        var defaults = {
            sightRadius:10,
            isSingleMap:true,
            widthSize:1,
            heightSize:1
        };

        this.options = GameUtils.extends({}, defaults, options);

        this._path = [];
        this._pathIndex =0;
    }

    WanderBehavior.prototype = {
        setMap : function(map){
            this._map = map;
            this.reset();
        },

        setPosition: function(pos){
            this._position = pos;
        },

        isSingleMap: function(){
            return this.options.isSingleMap;
        },
        _generatePath: function(){
            this._pathIndex =0;

            var target;

            if(this.isSingleMap()){
                target = this._findNearbySingleMapTarget();
            }
            else{
                target = this._findNearbyMultiMapTarget();
            }

            this._path = astar(this._map.grid, this._position, target, this.options.widthSize, this.options.heightSize) || [];

        },
        _mapDirection :function(pos){
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
        },

        _findNearbySingleMapTarget : function(){

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
                                if(commonUtils.isWalkableArea(this._map.grid, i, j,
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

        },

        _findNearbyMultiMapTarget : function(){

        },

        getNextMove : function(){

            if(this._pathIndex >= this._path.length)
            {
                this._generatePath();
            }

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

            return nextMove;
            //if(cb)
            //   cb(nextMove);
        },

        reset: function(){
            this._path =[];
            this._pathIndex=0;
        }

    };

    return WanderBehavior;

})();