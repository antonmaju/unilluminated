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

    MapView.prototype.resize = function(){
        this.options.mapRenderer.calculateViewport();
    }

    MapView.prototype.animate = function(time){
        var context = this.options.context;
        var canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.options.mapRenderer.render();

    };

    return MapView;

})();