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

        this._cacheCanvas = document.createElement('canvas');
        this._cacheContext = this._cacheCanvas.getContext('2d');

        this._init();
    }

    MapRenderer.prototype = Object.create(event.EventEmitter.prototype);

    MapRenderer.prototype._init = function(){

        this.on('resize', function(){
            this._calculateViewport();
            this._renderCache();
        });
    };

    MapRenderer.prototype.setGridSize = function(row, column){

    };


    MapRenderer.prototype.setGrid = function(grid){
        this._grid = grid;
        this.totalRow = this._grid.length;
        this.totalColumn = this._grid[0].length;
        this._calculateViewport();
        this._renderCache();

    };

    MapRenderer.prototype.setPlayer = function(player){
        this._player = player;
    };

    /// TODO: need to find better way to manage this, probably just create canvas in mapRenderer constructor
    MapRenderer.prototype.setInternalContext = function(internalContext){
        this.options.internalContext = internalContext;
    };

    MapRenderer.prototype.render = function(){
        if(! this._grid)
            return;

        this._calculateCamera();

        var context = this.options.context;
        var canvas = context.canvas;
        var internalContext= this.options.internalContext;

//        internalContext.clearRect(0,0, canvas.width, canvas.height);

        context.drawImage(this._cacheCanvas, this._startColumn * this.gridSize,this._startRow * this.gridSize ,
            canvas.width, canvas.height, 0, 0,
            canvas.width, canvas.height);

//        for(var i=this._startRow; i< this._startRow + this._rowPerScreen && i < this.totalRow; i++)
//        {
//            var cameraRow = i-this._startRow;
//            for(var j= this._startColumn; j< this._startColumn + this._columnPerScreen && j < this.totalColumn; j++)
//            {
//                var cameraColumn = j-this._startColumn;
//                var areaType = AreaTypes[this._grid[i][j].toString()];
//                var img = null;
//                var imgSource = null;
//                if(areaType.bgKey)
//                {
//                    imgSource = imageSource[areaType.bgKey];
//                    img = this.options.imageManager.get(imgSource.src);
//                    internalContext.drawImage(img,0,imgSource.top,imgSource.width,imgSource.height, cameraColumn * this.gridSize,cameraRow* this.gridSize,
//                        this.gridSize, this.gridSize);
//                }
//                if(areaType.srcKey)
//                {
//                    imgSource = imageSource[areaType.srcKey];
//                    img = this.options.imageManager.get(imgSource.src);
//                    internalContext.drawImage(img, 0,imgSource.top,imgSource.width,imgSource.height, cameraColumn * this.gridSize, cameraRow* this.gridSize,
//                        this.gridSize, this.gridSize);
//                }
//            }
//        }
//        context.drawImage(internalContext.canvas, 0,0);
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

    MapRenderer.prototype._renderCache = function(){
        if(! this._grid) return;

        this._cacheCanvas.width = this.gridSize * this.totalColumn;
        this._cacheCanvas.height = this.gridSize * this.totalRow;


        this._cacheContext.clearRect(0,0, this._cacheCanvas.width, this._cacheCanvas.height);

        for(var i= 0; i<this.totalRow; i++)
        {
            for(var j=0; j<this.totalColumn; j++)
            {
                var areaType = AreaTypes[this._grid[i][j].toString()];
                var img = null;
                var imgSource = null;

                if(areaType.bgKey)
                {
                    imgSource = imageSource[areaType.bgKey];
                    img = this.options.imageManager.get(imgSource.src);
                    this._cacheContext.drawImage(img,0,imgSource.top,imgSource.width,imgSource.height, j * this.gridSize,i* this.gridSize,
                        this.gridSize, this.gridSize);
                }
                if(areaType.srcKey)
                {
                    imgSource = imageSource[areaType.srcKey];
                    img = this.options.imageManager.get(imgSource.src);
                    this._cacheContext.drawImage(img, 0,imgSource.top,imgSource.width,imgSource.height, j * this.gridSize, i * this.gridSize,
                        this.gridSize, this.gridSize);
                }
            }
        }
    }

    return MapRenderer;
})();