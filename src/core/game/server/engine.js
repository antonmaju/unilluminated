var engineCommands = require('../../commands/engineCommands'),
    worldMap = require('./worldMap');


exports.start = function(app, io){

    io.sockets.on('connection', function(socket){

        function onResourceRequest(param){
            engineCommands.getInitialGameInfo(param, function(gameInfo){
                var playerInfo = null;
                var playerType =null;
                gameInfo.maps ={};

                for(var playerProp in gameInfo.players){
                    playerInfo = gameInfo.players[playerProp];
                    if(playerInfo.id == param.userId)
                    {
                        playerType =playerProp;
                        gameInfo.maps[playerType] = worldMap[playerInfo.map].src;
                        break;
                    }
                }
                socket.emit('resourceResponse', gameInfo);
            });
        }

        function onMovingToNewArea(param){

        };


        socket.on('resourceRequest', onResourceRequest);
        socket.on('movingToNewArea', onMovingToNewArea);
    });

};