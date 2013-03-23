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

        };


        socket.on('resourceRequest', onResourceRequest);
        socket.on('movingToNewArea', onMovingToNewArea);
    });

};