var gameCommands = require('./gameCommands')
    coreServices = require('../coreServices'),
    worldMap = require('../game/server/worldMap'),
    PlayerDirections = require('../game/playerDirections'),
    GameStates = require('../game/gameStates'),
    PlayerTypes = require('../game/playerTypes'),
    typeConverter = coreServices.typeConverter;

function getOppositeDirection(direction){
    switch(direction){
        case PlayerDirections.Top:
            return PlayerDirections.Bottom;
        case PlayerDirections.Left:
            return PlayerDirections.Right;
        case PlayerDirections.Right:
            return PlayerDirections.Left;
        case PlayerDirections.Bottom:
            return PlayerDirections.Top;
    }
}

/**
 * Get current game information
 * @param {object} param
 * Param should consist of
 * - id : game id
 * - userId : current user id
 * @param {function} callback
 */

exports.getInitialGameInfo = function(param, cb){
    var result = null;

    if (! param.id || ! param.userId) {
        cb(result);
        return;
    }

    var gameId= typeof param.id == 'string' ? typeConverter.fromString.toObjectId(param.id) : param.id;
    var userId = typeof param.userId == 'string' ?  typeConverter.fromString.toObjectId(param.userId) : param.userId;
    if(! gameId || ! userId) {
        cb(result);
        return;
    }

    gameCommands.getById(gameId, function(gameDataResult){

        if(gameDataResult.err || !gameDataResult.doc){
            cb(result);
            return;
        }

        result = {};
        var gameData = gameDataResult.doc;
        result.players = {};
        result.maps = {};

        //find players data

        var userInfo = null;
        for(var playerProp in gameData.players)
        {
            var playerInfo = gameData.players[playerProp];
            if(playerInfo.id.toString() == userId.toString())
            {
                result.players[playerProp] = playerInfo;
                userInfo = playerInfo;
                result.maps[playerProp] = worldMap[playerInfo.map].src;
                break;
            }
        }

        //find other players who are in the same map or if trace is set to true
        for(var playerProp in gameData.players)
        {
            var playerInfo = gameData.players[playerProp];
            if(playerInfo.id.toString() != userInfo.id.toString() && playerInfo.map == userInfo.map)
            {
                result.players[playerProp] = playerInfo;
            }
            else if(playerInfo.id.toString() != userInfo.id.toString() && playerInfo.trace)
            {
                result.players[playerProp] = playerInfo;
                result.maps[playerProp] = worldMap[playerInfo.map].src;
            }
        }

        cb(result);
    });
};


/**
 * Get next area information
 * @param {object} param
 * Param should consist of:
 * - id : game id
 * - userId: current user id
 * - direction: current user direction
 * @param {function} callback
 */
exports.getNewAreaInfo = function(param, cb){
    var result = null;

    if(! param.id || !param.userId || !param.direction){
        cb(result);
        return;
    }

    var gameId= typeof param.id == 'string' ? typeConverter.fromString.toObjectId(param.id) : param.id;
    var userId = typeof param.userId == 'string' ?  typeConverter.fromString.toObjectId(param.userId) : param.userId;
    var direction = param.direction;

    if(! gameId || ! userId) {
        cb(result);
        return;
    }

    if(direction != PlayerDirections.Bottom && direction != PlayerDirections.Left &&
        direction !=  PlayerDirections.Right && direction != PlayerDirections.Top)
    {
        cb(result);
        return;
    }

    gameCommands.getById(gameId, function(gameDataResult){
        if(gameDataResult.err || !gameDataResult.doc){
            cb(result);
            return;
        }

        result = {};
        var gameData = gameDataResult.doc;
        result.players = {};
        result.maps = {};

        //find players data

        var userInfo = null;
        for(var playerProp in gameData.players)
        {
            var playerInfo = gameData.players[playerProp];
            if(playerInfo.id.toString() == userId.toString())
            {
                result.players[playerProp] = playerInfo;
                userInfo = playerInfo;
                var newMapName =  worldMap[playerInfo.map].links[direction];
                playerInfo.map = newMapName;
                playerInfo.direction = getOppositeDirection(direction);
                result.maps[playerProp] = worldMap[newMapName].src;
                break;
            }
        }

        //process enemy generation


        //save current state
        function onGameDataUpdated(updatedData){
            if(updatedData.error)
            {
                cb(updatedData);
                return;
            }

            //find other players who are in the same map or if trace is set to true
            for(var playerProp in gameData.players)
            {
                var playerInfo = gameData.players[playerProp];
                if(playerInfo.id.toString() != userInfo.id.toString() && playerInfo.map == userInfo.map)
                {
                    result.players[playerProp] = playerInfo;
                }
//                else if(playerInfo.id != userInfo.id && playerInfo.trace)
//                {
//                    result.players[playerProp] = playerInfo;
//                    result.maps[playerProp] = worldMap[playerInfo.map].src;
//                }
            }

            cb(result);
        }

        gameCommands.save(gameData,onGameDataUpdated);
    });
};

exports.handleEndGame = function(param, cb){
    var result = null;

    if(! param.id || !param.userId || !param.winnerId){
        cb(result);
        return;
    }

    var gameId= typeof param.id == 'string' ? typeConverter.fromString.toObjectId(param.id) : param.id;
    var userId = typeof param.userId == 'string' ?  typeConverter.fromString.toObjectId(param.userId) : param.userId;
    var winnerId = typeof param.winnerId == 'string' ? typeConverter.fromString.toObjectId(param.winnerId) : param.winnerId;

    if(! gameId || ! userId || ! winnerId)
    {
        cb(result);
        return;
    }

    gameCommands.getById(gameId, function(gameDataResult){
        if(gameDataResult.err || !gameDataResult.doc){
            cb(result);
            return;
        }

        result = {};
        var gameData = gameDataResult.doc;

        if(gameData.state != GameStates.Running){
            cb(result);
            return;
        }

        var winnerFound = false;

        for(var type in gameData.players)
        {
            var playerInfo = gameData.players[type];
            if(playerInfo.id.toString() == winnerId.toString()){
                winnerFound= true;
                break;
            }
        }

        if(! winnerFound){
            cb(result);
            return;
        }

        gameData.state = GameStates.Finished;
        gameData.winnerId = winnerId;

        function onGameUpdated(updatedData){
            if(updatedData.error)
            {
                cb(false);
                return;
            }

            cb(true);
        }

        gameCommands.save(gameData, onGameUpdated);
    });
};
