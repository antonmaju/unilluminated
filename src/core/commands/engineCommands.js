/**
 * Get current game information
 * @param param
 * Param should consist of
 * - id : game id
 * - userId : current user id
 */

exports.getInitialGameInfo = function(param, cb){
    var result = null;

    if (! param.id || ! param.userId)
    {
        cb(result);
        return;
    }

    var gameId=typeConverter.fromString.toObjectId(data.id);
    if(! gameId)
    {
        cb(result);
        return;
    }


    cb(result);
};
