module.exports = (function(){

    var GameTypes = require('./gameTypes'),
        GameStates = require('./gameStates'),
        GameUtils = require('./commonUtils'),
        event = require('events');

    var Game = function(options){
        event.EventEmitter.call(this);

        var defaults = {
            gameType: GameTypes.SinglePlayer
        };

        this._state = GameStates.Stopped;
        this.options = GameUtils.extends({}, defaults, options);

        if(this._init)
            this._init();

    }

    Game.prototype = Object.create(event.EventEmitter.prototype);

    Game.prototype.setState = function(state){
        if(this._state == state)
            return;

        var oldState = this._state;
        this._state = state;
        this.emit('stateChanged', {oldState:oldState, newState:state});
    };

    return Game;
})();