/**
 * This view displays map screen
 * @param {Object} options
 * @constructor
 */
module.exports = (function(){

    var event = require('events'),
        GameUtils = require('../../commonUtils');

    function MapView(options){
        event.EventEmitter.call(this);
        this.id='map';

        var defaults ={
            minInterval : 500
        };

        this.options = GameUtils.extends({},defaults,options);
        this._init();
    }

    MapView.prototype = Object.create(event.EventEmitter.prototype);

    MapView.prototype._init = function(){
        var self = this;

        self.on('activated', function(data){

        });

    };
    /**
     * Resizes map
     * @method
     */
    MapView.prototype.resize = function(){
        this.options.mapRenderer.emit('resize');
    }
    /**
     * Renders map
     * @param time
     * @method
     */
    MapView.prototype.animate = function(time){
        var context = this.options.context;
        var canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.options.mapRenderer.render();

    };

    return MapView;

})();