var Game = require('../game');


Game.prototype._init = function()
{

};

Game.prototype._initEventHandlers = function(){

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



