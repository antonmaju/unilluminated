module.exports = (function(){
    var event = require('events'),
        GameUtils = require('../commonUtils'),
        WanderBehavior = require('./wanderBehavior'),
        ChaseBehavior = require('./chaseBehavior');

    var AiState ={
        Wander :1,
        Chase : 2
    };

    function GuardianBehavior(options){
        event.EventEmitter.call(this);

        this._wanderBehavior = new WanderBehavior(options);
        this._chaseBehavior = new ChaseBehavior(options);
    }

    GuardianBehavior.prototype = Object.create(event.EventEmitter.prototype);

});