exports.start = function(app, io){



    io.sockets.on('connection', function(socket){

        function onResourceRequest(data){
            var result = {
                prop1: 'value1',
                prop2: 'value2'
            };

            socket.emit('resourceResponse', result);
        }


        socket.on('resourceRequest', onResourceRequest);
    });

};