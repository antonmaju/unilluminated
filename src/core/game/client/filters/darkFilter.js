module.exports = (function(){

    var FilterBase = require('./filterBase');

    function DarkFilter(){

    }

    DarkFilter.prototype = Object.create(FilterBase.prototype);

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

    return DarkFilter;
})();