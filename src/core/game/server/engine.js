var engineCommands = require('../../commands/engineCommands'),
    worldMap = require('./worldMap');

exports.start = function(app, io){

    io.sockets.on('connection', function(socket){

        function onResourceRequest(param){
            engineCommands.getInitialGameInfo(param, function(gameInfo){
                gameInfo.player.mapInfo = worldMap[gameInfo.player.map].src;

                socket.emit('resourceResponse', gameInfo);
            });
        }

        socket.on('resourceRequest', onResourceRequest);
    });

};