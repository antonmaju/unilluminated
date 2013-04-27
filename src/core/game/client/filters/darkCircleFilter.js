var FilterBase = require('./filterBase');

module.exports = function(){
    function DarkCircleFilter(){

    }

    DarkCircleFilter.prototype = Object.create(FilterBase.prototype);

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

    DarkCircleFilter.prototype.applyPostRenderGame = function(options){
        var context = options.context;

        if(! context) return;

        context.restore();
    };

    return DarkCircleFilter;
}();