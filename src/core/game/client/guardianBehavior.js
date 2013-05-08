module.exports = (function(){
    var event = require('events'),
        GameUtils = require('../commonUtils'),
        WanderBehavior = require('./wanderBehavior'),
        ChaseBehavior = require('./chaseBehavior'),
        PlayerMode = require('./playerMode');

    /**
     * This class wraps guardian AI
     * @param {object} options
     * @constructor
     */
    function GuardianBehavior(options){
        event.EventEmitter.call(this);

        var defaults={
            evaluationStep: 3,
            sightRadius: 10,
            widthSize: 1,
            heightSize: 1
        };

        this._wanderBehavior = new WanderBehavior(options);
        this._chaseBehavior = new ChaseBehavior(options);
        this._state = PlayerMode.Wander;
        this._behavior = this._wanderBehavior;

        this.options = GameUtils.extends({}, defaults, options);
        this._counter = 0;

        this._init();
    }

    GuardianBehavior.prototype = Object.create(event.EventEmitter.prototype);

    /**
     * Gets current AI state
     * @returns {int}
     */
    GuardianBehavior.prototype.getState = function(){
        return this._state;
    };

    /**
     * Sets enemy
     * @param {object} enemy
     */
    GuardianBehavior.prototype.setEnemy = function(enemy){
        this._enemy = enemy;
    };

    /**
     * Gets enemy
     * @returns {*}
     */
    GuardianBehavior.prototype.getEnemy = function(){
        return this._enemy;
    };

    /**
     * Sets current map
     * @param {object} map
     */
    GuardianBehavior.prototype.setMap = function(map){
        this._map = map;
        this._wanderBehavior.setMap(map);
        this._chaseBehavior.setMap(map);
    };

    /**
     * Gets current map
     * @param map
     * @returns {object} map
     */
    GuardianBehavior.prototype.getMap = function(map){
        return this.getMap();
    };

    /**
     * Sets current position
     * @param {object} pos
     */
    GuardianBehavior.prototype.setPosition = function(pos){
        this._position = pos;
        this._wanderBehavior.setPosition(pos);
        this._chaseBehavior.setPosition(pos);
    };

    /**
     * Gets current position
     * @returns {object}
     */
    GuardianBehavior.prototype.getPosition = function(){
        return this._position;
    };

    /**
     * Requests AI to generate next position
     */
    GuardianBehavior.prototype.getNextMove = function(){
        var enemy = this.getEnemy();
        if(this._counter >= this.options.evaluationStep){
            var seen = GameUtils.isPlayerSeen(enemy, this._position.row, this._position.column,
                this.options.sightRadius);

            this._counter = 0;
            if(seen && this._state == PlayerMode.Wander){
                this.emit('stateChanged', { oldState: this._state , newState: PlayerMode.Chase});
            }else if(! seen && this._state == PlayerMode.Chase){
                this.emit('stateChanged',  { oldState: this._state, newState: PlayerMode.Wander});
            }

            if(this._state == PlayerMode.Chase)
            {
                this._behavior.setTarget({row: enemy.row, column: enemy.column});
            }
        }
        else
            this._counter++;

        this._behavior.getNextMove();
    };

    GuardianBehavior.prototype._init = function(){
        var self=this;

        this.on('stateChanged', function(data){
            switch(data.newState){
                case PlayerMode.Chase:
                    this._state = data.newState;
                    this._behavior = this._chaseBehavior;
                    break;
                case PlayerMode.Wander:
                    this._state = data.newState;
                    this._behavior = this._wanderBehavior;
                    break;
            }
            this._behavior.setPosition(this._position);
        });

        this._wanderBehavior.on('nextMoveGenerated', function(nextMove){
            if(self.getState() != PlayerMode.Wander) return;

            self._position = nextMove;
            self.emit('nextMoveGenerated', nextMove);
        });

        this._chaseBehavior.on('nextMoveGenerated', function(nextMove){
            if(self.getState() != PlayerMode.Chase) return;

            self._position = nextMove;
            self.emit('nextMoveGenerated', nextMove);
        });
    };

    return GuardianBehavior;
})();