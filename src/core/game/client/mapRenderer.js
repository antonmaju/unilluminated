module.exports = (function(){

    var GameUtils = require('../commonUtils');
    var AreaTypes = require('../areaTypes');
    var imageSource = require('../imageSource');
    var event = require('events');

    /**
     * This class is responsible for rendering map to canvas
     * @param {object} options
     * @constructor
     */
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
            this._setTiles();
            this._calculateViewport();
            this._renderCache();
        });
    };

    /**
     * Sets current map grid
     * @param {Array} grid
     */
    MapRenderer.prototype.setGrid = function(grid){
        this._grid = grid;
        this.totalRow = this._grid.length;
        this.totalColumn = this._grid[0].length;
        this._setTiles();
        this._calculateViewport();
        this._renderCache();
    };

    /**
     * Sets current active player
     * @param {object} player
     */
    MapRenderer.prototype.setPlayer = function(player){
        this._player = player;
    };

    /// TODO: need to find better way to manage this, probably just create canvas in mapRenderer constructor
    MapRenderer.prototype.setInternalContext = function(internalContext){
        this.options.internalContext = internalContext;
    };


    /**
     * Renders map to canvas
     */
    MapRenderer.prototype.render = function(){
        if(! this._grid)
            return;

        this._calculateCamera();

        var context = this.options.context;
        var canvas = context.canvas;

        this.options.filterManager.get().applyPreRenderMap({
            context : context,
            player : this._player,
            startRow: this._startRow,
            startColumn : this._startColumn,
            gridSize: this.gridSize
        });

        var startClipX = this._startColumn * this.gridSize;
        var startClipY = this._startRow * this.gridSize;

        if(startClipX + canvas.width > this._cacheCanvas.width)
        {
            console.log('test');
            startClipX = this._cacheCanvas.width - canvas.width;
        }

        if(startClipY + canvas.height > this._cacheCanvas.height)
            startClipY = this._cacheCanvas.height - canvas.height;

        context.drawImage(this._cacheCanvas,startClipX, startClipY,
            canvas.width, canvas.height, 0, 0,
            canvas.width, canvas.height);

        this.options.filterManager.get().applyPostRenderMap({
            context : context,
            player : this._player,
            startRow: this._startRow,
            startColumn : this._startColumn,
            gridSize: this.gridSize
        });
    };

    MapRenderer.prototype._calculateCamera = function(){
        if(!this._player) return;

        this._startRow = this._player.row - this._idealCameraRowRange;

        if(this._startRow < 0)
            this._startRow = 0;
        else if(this._player.row + this._idealCameraRowRange >= this.totalRow)
            this._startRow = this.totalRow - (this. _idealCameraRowRange * 2) ;


        this._startColumn = this._player.column- this. _idealCameraColRange ;
        if(this._startColumn <0)
            this._startColumn =0;
        else if(this._player.column + this. _idealCameraColRange >= this.totalColumn)
            this._startColumn = this.totalColumn - (this. _idealCameraColRange *2);



    };

    MapRenderer.prototype._calculateViewport = function(){
        var canvas = this.options.context.canvas;
        this.gridSize =canvas.width / this._columnPerScreen;

        this._idealCameraColRange =  Math.floor(this._columnPerScreen/2);
        this._idealCameraRowRange =  Math.floor(this._rowPerScreen/2);

    };

    MapRenderer.prototype._setTiles = function(){
        this._columnPerScreen=8;
        this._rowPerScreen=6;

        if(window.innerWidth > 480)
        {
            this._columnPerScreen=12;
            this._rowPerScreen=9;
        }
        if(window.innerWidth > 600)
        {
            this._columnPerScreen=16;
            this._rowPerScreen=12;
        }
    };

    MapRenderer.prototype._renderCache = function(){
        if(! this._grid) return;

        var context = this.options.context;
        var canvas = context.canvas;

        this._cacheCanvas.width = Math.ceil(this.gridSize * this.totalColumn);
        this._cacheCanvas.height = Math.ceil(this.gridSize * this.totalRow);

        this._cacheContext.clearRect(0,0, this._cacheCanvas.width, this._cacheCanvas.height);

        this.options.filterManager.get().applyPreRenderInternalMap({
            context: this._cacheContext
        });

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

        this.options.filterManager.get().applyPostRenderInternalMap({
            context: this._cacheContext
        });

    }

    return MapRenderer;
})();