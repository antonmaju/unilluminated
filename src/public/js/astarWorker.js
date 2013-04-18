var astar = require('../../core/game/client/astar');

onmessage = function(evt){
    var data = evt.data;
    var path = astar(data.grid, data.start, data.end, data.widthSize, data.heightSize);

    postMessage(path);

};