module.exports = (function(){
    var event = require('events');

    function InputBuffer(interval){
        this._queue = [];
        this._interval = interval;
        this._init();
    }

    InputBuffer.prototype = Object.create(event.EventEmitter.prototype);

    InputBuffer.prototype.addInput = function(input){
        this._queue.push(input);
        this.emit('inputAdded', input);
    };

    InputBuffer.prototype._init = function(){
        var self= this;

        this.on('inputAdded', function(evt){
            if(self._intervalId || self._queue.length == 0) return;

            self.emit('inputPublished', self._queue.shift());

            self._intervalId = setInterval(function(){

                if(self._queue.length == 0){
                    clearInterval(self._intervalId);
                    self._intervalId = null;
                }else{
                    self.emit('inputPublished', self._queue.shift());
                }

            }, this._interval);
        });
    };


    return InputBuffer;

})();