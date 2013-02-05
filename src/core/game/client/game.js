var Game = require('../game');



Game.prototype._initEventHandlers = function(){
    var socket = this.options.socket;

    this.on('initializing', function(data){

        socket.emit('resourceRequest');

    });

    socket.on('resourceResponse', function(data){
        alert(JSON.stringify(data, null, 4));
        //console.log(data);
    });
};

Game.prototype._initViews = function(){

};

Game.prototype._initPlayers = function(){

};


/***
 * Get current fps
 * @param time current timestamp
 * @return {Number} fps number
 */
Game.prototype.getFps = function(time){
    var fps =0;
    if(this.lastTime)
        fps = 1000/ (time - this.lastTime);
    this.lastTime = time;
    return fps;

};

Game.prototype._initAssets = function(){

};

Game.prototype.render = function(){

};

Game.prototype._init = function()
{
    this._initEventHandlers();
};

module.exports = Game;

