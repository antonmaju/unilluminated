module.exports = (function(){

    var GameTypes = require('./gameTypes'),
        GameStates = require('./gameStates'),
        GameUtils = require('./commonUtils'),
        event = require('events');

    var Game = function(options){
        event.EventEmitter.call(this);

        var defaults = {
            gameType: GameTypes.SinglePlayer,
            state : GameStates.Stopped
        };

        this.options = GameUtils.extends({}, defaults, options);
        if(this._init)
            this._init();

    }

    Game.prototype = Object.create(event.EventEmitter.prototype);

    Game.prototype.setState = function(state){
        this.options.state = state;
        this.emit('statechange', state);
    };

    return Game;
})();