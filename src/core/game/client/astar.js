var ds=require('./ds'),
    AreaTypes = require('../areaTypes');

function ManhattanDistance(start, end){
    return Math.abs(end.row-start.row) + Math.abs(end.column-start.column);
};

function getPossiblePositions(grid, pos){
    var connections = [];
    var totalRow = grid.length;
    var totalColumn = grid[0].length;

    if(pos.row > 0 && AreaTypes[grid[pos.row-1][pos.column]].isWalkable){
        connections.push({row:pos.row-1, column:pos.column});
    }
    if(pos.column > 0 && AreaTypes[grid[pos.row][pos.column-1]].isWalkable){
        connections.push({row:pos.row, column:pos.column-1});
    }
    if(pos.row < totalRow-1  && AreaTypes[grid[pos.row+1][pos.column]].isWalkable){
        connections.push({row:pos.row+1, column:pos.column});
    }
    if(pos.column < totalColumn-1 && AreaTypes[grid[pos.row][pos.column+1]].isWalkable){
        connections.push({row:pos.row, column:pos.column+1});
    }
    return connections;
}

function stringifyPosition(pos){
    return ''+pos.row+','+pos.column;
}

function convertToPosition(posString){
    var arr = posString.split(',');
    return {row:parseInt(arr[0],10),column:parseInt(arr[1],10)};
}

function samePosition(pos1,pos2){
    return pos1.row==pos2.row && pos1.column == pos2.column;
}

function reconstructPath(cameFrom, current){
    var stringPos = current;
    if(cameFrom[stringPos]){
        var paths = reconstructPath(cameFrom, cameFrom[stringPos])
        return paths + ";" + stringPos;
    }
    else{
        return stringPos;
    }
}

function convertPathStringsToPositions(positions){
    var posList = positions.split(';');
    var points =[];
    for(var i=0; i<posList.length; i++){
        var pos = posList[i].split(',');
        points.push({row:parseInt(pos[0],10), column:parseInt(pos[1], 10)});
    }
    return points;
}

module.exports = function(grid, start, end){
    var heuristic = ManhattanDistance;
    var closedHash = {};
    var openSet = new ds.PriorityQueue();
    var openHash = {};

    var gScore ={};
    var fScore = {};
    var cameFrom = {};

    var stringPos = stringifyPosition(start);
    gScore[stringPos] = 0;
    fScore[stringPos] = heuristic(start,end);
    openSet.enqueue(stringPos, fScore[stringPos]);
    openHash[stringPos]=true;

    while(openSet.size() > 0){
        stringPos = openSet.dequeue().item;
        var current = convertToPosition(stringPos);
        openHash[stringPos] = false;

        if(samePosition(current, end))
            return convertPathStringsToPositions(reconstructPath(cameFrom,stringPos));

        closedHash[stringPos]=true;

        var positions = getPossiblePositions(grid, current);

        for(var i=0; i<positions.length; i++){
            var newPos = positions[i];
            var newStringPos = stringifyPosition(newPos);
            var newGScore = gScore[stringPos] + 1;

            if(closedHash[newStringPos] && newGScore >= gScore[newStringPos])
                continue;


            if(! openHash[newStringPos] || newGScore < gScore[newStringPos])
            {
                cameFrom[newStringPos] = stringPos;
                gScore[newStringPos] = newGScore;
                fScore[newStringPos]= newGScore + heuristic(newPos, end);

                if(! openHash[newStringPos])
                {
                    openSet.enqueue(newStringPos, fScore[newStringPos]);
                    openHash[newStringPos]=true;
                }
            }
        }
    }
    return null;
};