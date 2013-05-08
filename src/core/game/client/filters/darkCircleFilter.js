module.exports = (function(){

    var FilterBase = require('./filterBase');

    /**
     * This filter creates a darkened version of map , and performs clipping so only small circular part
     * of map will be shown
     * @constructor
     */
    function DarkCircleFilter(){
    }

    DarkCircleFilter.prototype = Object.create(FilterBase.prototype);

    /**
     * Performs circular clipping before rendering map in viewport
     * @param {Object} options
     * Options param consists of:
     * - context : canvas context
     * - player : current player instance
     * - startRow: start row of map
     * - startColumn: start column of map
     * - gridSize: map's grid size
     */
    DarkCircleFilter.prototype.applyPreRenderMap = function(options)
    {
        var context = options.context;
        var player = options.player;
        var startRow = options.startRow;
        var startColumn = options.startColumn;
        var gridSize = options.gridSize;

        if(! context || !player || startRow == null || startColumn == null || gridSize == null)
            return;

        var canvas = context.canvas;

        context.save();
        context.fillStyle ='rgba(0,0,0,0.95)';
        context.fillRect(0,0,canvas.width, canvas.height);
        context.restore();

        var curRow = player.row- startRow;
        var curColumn = player.column - startColumn;

        context.save();
        context.beginPath();
        context.arc(curColumn * gridSize, curRow * gridSize,
            player.getSightRadius() * gridSize ,0, Math.PI *2, false);
        context.clip();
    };

    /***
     * Darkens the map area after rendering map in internal canvas
     * @param {Object} options
     * Options object consists of:
     * - context: canvas context
     */
    DarkCircleFilter.prototype.applyPostRenderInternalMap = function(options){
        var context = options.context;
        var canvas = context.canvas;

        var imageData = context.getImageData(0,0, canvas.width, canvas.height);
        var data = imageData.data;

        var saturationQuantity = 0.7;

        var blend =[27,34,38,174]

        //apply saturation then overlay with #1b2230 for night effect
        for(var i=0; i<= data.length -4; i+=4)
        {
            var maxValue = Math.max(data[i], data[i+1], data[i+2]);

            if(data[i] !=  maxValue)
                data[i] += (maxValue - data[i]) * saturationQuantity;

            if(data[i+1] !=  maxValue)
                data[i+1] += (maxValue - data[i+1]) * saturationQuantity;

            if(data[i+2] != maxValue)
                data[i+2] += (maxValue - data[i+2]) * saturationQuantity;


            for(var j=i; j<=i+3; j++)
                data[j] =(data[j]> 128) ? (2 * blend[j-i] * data[j] / 255) : (255 - 2 * (255 - blend[j-i]) * (255 - data[j]) / 255);

        }

        context.putImageData(imageData,0,0);
    };

    /**
     * Restores context state after rendering view
     * @param options
     */
    DarkCircleFilter.prototype.applyPostRenderGame = function(options){
        var context = options.context;

        if(! context) return;

        context.restore();
    };

    return DarkCircleFilter;
})();