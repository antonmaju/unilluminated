/**
 * This view displays loading screen
 * @param {Object} options
 * @constructor
 */
module.exports = (function(){


    var event = require('events'),
        GameUtils = require('../../commonUtils');

    /**
     * This view displays loading screen
     * @param {Object} options
     * @constructor
     */
    function LoadingView(options){
        event.EventEmitter.call(this);

        var defaults ={
            minInterval : 500
        };

        this.options = GameUtils.extends({},defaults,options);
        this._lastTime = + new Date;

        this._counter =0;
        this.id = 'loading';
        this._init();
    }


    LoadingView.prototype = Object.create(event.EventEmitter.prototype);

    /**
     * Initializes loading screen
     */
    LoadingView.prototype._init = function(){

        var self = this;

        self.on('activated', function(data){
            self._lastTime = + new Date;
            self._counter =0;
        });

    };

    LoadingView.prototype.resize = function(){

    };

    /**
     * Animates loading..... text
     * @param time
     * @method
     */
    LoadingView.prototype.animate = function(time){

        if(time - this._lastTime < this.options.minInterval)
            return;

        var context = this.options.context;
        var canvas = context.canvas;
        var fontSize = Math.ceil(canvas.width /30);
        context.clearRect(0,0, canvas.width, canvas.height);
        context.save();
        context.fillStyle ='black';
        context.textAlign='center';
        context.font = fontSize+'px Arial';

        this._counter = (this._counter + 1) % 3;
        var text = 'Loading ';
        for(var i=0; i<= this._counter; i++)
            text+='. ';
        context.fillText(text, canvas.width/2, canvas.height/2);
        context.restore();

        this._lastTime = time;
    };

    return LoadingView;
})();