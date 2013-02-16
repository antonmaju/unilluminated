module.exports = (function(){

    var GameUtils = require('../commonUtils');
    var AreaTypes = require('../areaTypes');
    var imageSource = require('../imageSource');
    var event = require('events');

    function MapRenderer(options){

        event.EventEmitter.call(this);

        var defaults = {};

        this.options = GameUtils.extends({}, defaults, options);
        this._startRow = 0;
        this._startColumn =0;

        //public properties

        this._columnPerScreen = 16;
        this._rowPerScreen = 12;

        this._init();
    }


    MapRenderer.prototype = Object.create(event.EventEmitter.prototype);

    MapRenderer.prototype._init = function(){

        this.on('resize', function(){
            this._calculateViewport();
        });
    };

    MapRenderer.prototype.setGridSize = function(row, column){

    };


    MapRenderer.prototype.setGrid = function(grid){
        this._grid = grid;
        this.totalRow = this._grid.length;
        this.totalColumn = this._grid[0].length;
        this._calculateViewport();

    };

    MapRenderer.prototype.setPlayer = function(player){
        this._player = player;
    };



    /// TODO: need to find better way to manage this, probably just create canvas in mapRenderer constructor
    MapRenderer.prototype.setInternalContext = function(internalContext){
        this.options.internalContext = internalContext;
    };

    MapRenderer.prototype.render= function(){
        if(! this._grid)
            return;

        this._calculateCamera();

        var context = this.options.context;
        var canvas = context.canvas;
        var internalContext= this.options.internalContext;

        internalContext.clearRect(0,0, canvas.width, canvas.height);

        for(var i=this._startRow; i< this._startRow + this._rowPerScreen && i < this.totalRow; i++)
        {
            var cameraRow = i-this._startRow;
            for(var j= this._startColumn; j< this._startColumn + this._columnPerScreen && j < this.totalColumn; j++)
            {
                var cameraColumn = j-this._startColumn;
                var areaType = AreaTypes[this._grid[i][j].toString()];
                var img = null;
                if(areaType.bgKey)
                {
                    img = this.options.imageManager.get(areaType.bgKey);
                    internalContext.drawImage(img,cameraColumn * this.gridSize,cameraRow* this.gridSize,
                        this.gridSize, this.gridSize);
                }
                if(areaType.srcKey)
                {
                    img = this.options.imageManager.get(areaType.srcKey);
                    internalContext.drawImage(img, cameraColumn * this.gridSize, cameraRow* this.gridSize,
                        this.gridSize, this.gridSize);
                }
            }
        }
        context.drawImage(internalContext.canvas, 0,0);
    };
    MapRenderer.prototype._calculateCamera = function(){
        if(!this._player) return;

        this._startRow = this._player.row - this._idealCameraRowRange;

        if(this._startRow < 0)
            this._startRow = 0;
        else if(this._player.row + this._idealCameraRowRange >= this.totalRow)
            this._startRow = this.totalRow - (this. _idealCameraRowRange * 2);


        this._startColumn = this._player.column- this. _idealCameraColRange ;
        if(this._startColumn <0)
            this._startColumn =0;
        else if(this._player.column + this. _idealCameraColRange >= this.totalColumn)
            this._startColumn = this.totalColumn - (this. _idealCameraColRange *2);


    };
    MapRenderer.prototype._calculateViewport = function(){
        var canvas = this.options.context.canvas;
        this.gridSize = canvas.width / this._columnPerScreen;

        this._idealCameraColRange =  Math.floor(this._columnPerScreen/2);
        this._idealCameraRowRange =  Math.floor(this._rowPerScreen/2);

    };

    return MapRenderer;
})();