module.exports = (function(){

    var FilterBase = require('./filterBase');

    /**
     * This filter creates a darkened version of map
     * of map will be shown
     * @constructor
     */
    function DarkFilter(){

    }

    DarkFilter.prototype = Object.create(FilterBase.prototype);

    /***
     * Darkens the map area after rendering map in internal canvas
     * @param {Object} options
     * Options object consists of:
     * - context: canvas context
     */
    DarkFilter.prototype.applyPostRenderInternalMap = function(options){
        var context = options.context;
        var canvas = context.canvas;

        var imageData = context.getImageData(0,0, canvas.width, canvas.height);
        var data = imageData.data;

        var saturationQuantity = 0.7;

        var blend =[54,68,96,174]

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
     * Apply filter for player (when hide)
     * @param options
     */
    DarkFilter.prototype.applyFilterForPlayer= function (options){
        var context = options.context;
        var canvas = context.canvas;

        var imageData = context.getImageData(0,0, canvas.width, canvas.height);
        var data = imageData.data;


        var saturationQuantity = 0.7;

        var blend =[54,68,96,174]

        //apply saturation then overlay with #1b2230 for night effect
        for(var i=0; i<= data.length -4; i+=4)
        {
            if(data[i+3] == 0)
                continue;


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

    return DarkFilter;
})();