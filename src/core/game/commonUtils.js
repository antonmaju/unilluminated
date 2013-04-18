/***
 * Perform shallow copy of obj2 to obj1
 * @param obj1 copy target
 * @param obj2 object to be copied
 */

var AreaTypes = require('./areaTypes');

var merge =  function(obj1, obj2){
    if (obj1 && obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
    }
};

exports.extends = function(obj1, obj2, obj3){

    if(obj1 && obj2)
    {
        merge(obj1, obj2);
        if(obj3)
            merge(obj1, obj3);
    }

    return obj1;
};

exports.isWalkableArea = function(grid, row, column,widthSize, heightSize)
{
    var totalRow = grid.length;
    var totalColumn = grid[0].length;
    for(var i=row; i<row+widthSize; i++){
        if(i < 0 || i>= totalRow) return false;

        for(var j=column; j<column+heightSize; j++){
            if(j<0 || j>= totalColumn) return false;

            if(! AreaTypes[grid[i][j]].isWalkable)
                return false;
        }
    }

    return true;
};


exports.isPlayerSeen = function(player, currentRow, currentCol, sightRadius){
    var posList = player.getOccupiedPositions();
    for(var i=0; i<posList.length; i++){
        var pos = posList[i];
        if(Math.abs(pos.row - currentRow) <= sightRadius && Math.abs(pos.column - currentCol) <= sightRadius)
            return true;
    }

    return false;
};

