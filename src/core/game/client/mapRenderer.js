module.exports = (function(){

    var GameUtils = require('../commonUtils');
    var AreaTypes = require('../areaTypes');
    var imageSource = require('../imageSource');

    function MapRenderer(options){
        var defaults = {};

        this.options = GameUtils.extends({}, defaults, options);
    }

    MapRenderer.prototype = {
        _startRow: 0,
        _startColumn: 0,

        setGrid: function(grid){
            this._grid = grid;
            this._totalRow = this._grid.length;
            this._totalColumn = this._grid[0].length;
            this._calculateViewport();
        },

        setPlayer: function(player){
            this._player = player;
        },

        /// TODO: need to find better way to manage this
        setInternalContext : function(internalContext){
            this.options.internalContext = internalContext;
        },


        render: function(){

            if(! this._grid)
                return;

            this._calculateCamera();

            var context = this.options.context;
            var canvas = context.canvas;
            var internalContext= this.options.internalContext;

            internalContext.clearRect(0,0, canvas.width, canvas.height);



            var curRow = this._player.getRow()- this._startRow;
            var curColumn = this._player.getColumn()- this._startColumn;

            /*
            context.save();
            context.beginPath();
            context.arc(curColumn * this.gridSize,curRow * this.gridSize,
                this.player.options.sightRadius * this.gridSize ,0, Math.PI *2, false);
            context.clip();
            */
            for(var i=this._startRow; i< this._startRow + this.rowPerScreen && i < this._totalRow; i++)
            {
                var cameraRow = i-this._startRow;
                for(var j= this._startColumn; j< this._startColumn + this.columnPerScreen && j < this._totalColumn; j++)
                {
                    var cameraColumn = j-this._startColumn;
                    var areaType = AreaTypes[this._grid[i][j].toString()];
                    var img = null;
                    if(areaType.bgKey)
                    {
                        img = this.options.imageManager.get(areaType.bgKey);
                        internalContext.drawImage(img,cameraColumn * this.gridSize,cameraRow* this.gridSize, this.gridSize, this.gridSize);
                    }
                    if(areaType.srcKey)
                    {
                        img = this.options.imageManager.get(areaType.srcKey);
                        internalContext.drawImage(img, cameraColumn * this.gridSize, cameraRow* this.gridSize, this.gridSize, this.gridSize);
                    }
                }
            }
            context.drawImage(internalContext.canvas, 0,0);
        },
        _calculateCamera : function(){
            if(!this._player) return;

            this._startRow = this._player.getRow() - this.idealCameraRowRange;

            if(this._startRow < 0)
                this._startRow = 0;
            else if(this._player.getRow() + this.idealCameraRowRange >= this._totalRow)
                this._startRow = this._totalRow - (this. idealCameraRowRange * 2);

            this._startColumn = this._player.getColumn()- this. idealCameraColRange ;
            if(this._startColumn <0)
                this._startColumn =0;
            else if(this._player.getColumn() + this. idealCameraColRange >= this._totalColumn)
                this._startColumn = this._totalColumn - (this. idealCameraColRange *2);

        },
        _calculateViewport : function(){
            var canvas = this.options.context.canvas;

            this.columnPerScreen = 16;
            this.rowPerScreen = 12;
            this.gridSize = canvas.width / this.columnPerScreen;

            this.idealCameraColRange =  Math.floor(this.columnPerScreen/2);
            this.idealCameraRowRange =  Math.floor(this.rowPerScreen/2);

        }
    };

    return MapRenderer;
})();