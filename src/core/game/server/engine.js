var engineCommands = require('../../commands/engineCommands'),
    worldMap = require('./worldMap');


exports.start = function(app, io){

    io.sockets.on('connection', function(socket){

        function onResourceRequest(param){
            engineCommands.getInitialGameInfo(param, function(gameInfo){
                socket.emit('resourceResponse', gameInfo);
            });
        }

        function onMovingToNewArea(param){
            engineCommands.getNewAreaInfo(param, function(gameInfo){
                socket.emit('movedToNewArea', gameInfo);
            });
        };

        function onGameEnded(param){
            engineCommands.handleEndGame(param, function(success){
                if(success){
                    socket.emit('gameEnded');
                }
            });
        }

        socket.on('resourceRequest', onResourceRequest);
        socket.on('movingToNewArea', onMovingToNewArea);
        socket.on('gameOverRequest', onGameEnded);
    });

};