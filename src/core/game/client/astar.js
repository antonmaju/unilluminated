var ds=require('./ds'),
    AreaTypes = require('../areaTypes'),
    commonUtils = require('../commonUtils') ;

/**
 * Calculates manhattan distance between 2 position
 * @param {Object} start
 * @param {Object} end
 * @returns {int} distance
 */
function ManhattanDistance(start, end){
    return Math.abs(end.row-start.row) + Math.abs(end.column-start.column);
};


/**
 * Gets arrays of walkable positions based on player position
 * @param {Array} grid map grid
 * @param {Object} pos position
 * @param {int} widthSize  player width
 * @param {int} heightSize player height
 * @returns {Array} array of possible positions
 */
function getPossiblePositions(grid, pos, widthSize, heightSize){
    var connections = [];

    if(commonUtils.isWalkableArea(grid, pos.row-1, pos.column, widthSize, heightSize))
        connections.push({row:pos.row-1, column:pos.column});

    if(commonUtils.isWalkableArea(grid, pos.row, pos.column-1, widthSize, heightSize))
        connections.push({row:pos.row, column:pos.column-1});

    if(commonUtils.isWalkableArea(grid, pos.row+1, pos.column, widthSize, heightSize))
        connections.push({row:pos.row+1, column:pos.column});

    if(commonUtils.isWalkableArea(grid, pos.row, pos.column+1, widthSize, heightSize))
        connections.push({row:pos.row, column:pos.column+1});

    return connections;
}

/**
 * Gets string manifestation of a position
 * @param {Object} pos
 * @returns {string}
 */
function stringifyPosition(pos){
    return ''+pos.row+','+pos.column;
}

/***
 * Converts position string to position object
 * @param posString
 * @returns {Object} position object
 */
function convertToPosition(posString){
    var arr = posString.split(',');
    return {row:parseInt(arr[0],10),column:parseInt(arr[1],10)};
}

/**
 * Determines whether a position is intersecting with other position
 * @param {Object} pos1
 * @param {Object} pos2
 * @param {int} widthSize
 * @param {int} heightSize
 * @returns {boolean}
 */
function isIntersect(pos1,pos2, widthSize, heightSize){
    for(var i=pos1.row; i< pos1.row + heightSize; i++ )
    {
        for(var j=pos1.column; j <pos1.column +widthSize; j++)
        {
            if(i == pos2.row && j== pos2.column)
                return true;
        }
    }

    return false;
}

/***
 * Returns path string indicating complete path to solution
 * @param {Object} cameFrom
 * @param {string} current position string
 * @returns {*}
 */
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

/***
 * Converts path string to position array
 * @param {string} positions path string
 * @returns {Array}
 */
function convertPathStringsToPositions(positions){
    var posList = positions.split(';');
    var points =[];
    for(var i=0; i<posList.length; i++){
        var pos = posList[i].split(',');
        points.push({row:parseInt(pos[0],10), column:parseInt(pos[1], 10)});
    }
    return points;
}

/***
 * Performs astar calculation
 * @param {Array} grid
 * @param {Object} start
 * @param {Object} end
 * @param {int} widthSize
 * @param {int} heightSize
 * @returns {Array}
 */
module.exports = function(grid, start, end, widthSize, heightSize){

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

        if(isIntersect(current, end, widthSize, heightSize))
            return convertPathStringsToPositions(reconstructPath(cameFrom,stringPos));

        closedHash[stringPos]=true;

        var positions = getPossiblePositions(grid, current,widthSize, heightSize);

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