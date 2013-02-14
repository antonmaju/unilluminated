var gameCommands = require('./gameCommands')
    coreServices = require('../coreServices'),
    typeConverter = coreServices.typeConverter;

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

        if(gameData.player1 && gameData.player1.id.toString() == userId.toString()){
            result.player = gameData.player1;
        }
        else
        {

        }

        cb(result);
    });
};
