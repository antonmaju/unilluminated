module.exports = (function(){

    var GameTypes = require('./GameTypes'),
        event = require('events');

    var Game = function(options){
        event.EventEmitter.call(this);

    }

    Game.prototype = Object.create(event.EventEmitter.prototype);

    Game.prototype.setState = function(state){
        this.options.state = state;
        this.emit('statechange', state);
    }

    return Game;
})();