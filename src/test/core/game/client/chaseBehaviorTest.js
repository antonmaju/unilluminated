var testSettings = require('../../../testSettings');

var should = require('should'),
    ChaseBehavior = require('../../../../core/game/client/chaseBehavior'),
    AreaTypes = require('../../../../core/game/areaTypes');

describe('ChaseBehavior', function(){
    describe('#getNextMove', function(){

        var map = {
            grid:[
                ['11','11','11','11','27','11','11','11','11'],
                ['11','11','11','11','12','11','11','11','11'],
                ['27','12','12','11','12','12','11','11','11'],
                ['27','12','12','12','12','12','12','12','27'],
                ['11','11','11','11','11','11','12','11','11'],
                ['11','11','11','11','11','11','12','11','11'],
                ['11','11','11','11','11','11','27','11','11']
            ]
        };

        it('should return walkable position', function(done){

            var behavior = new ChaseBehavior({
                sightRadius: 5
            });

            behavior.setMap(map);
            behavior.setPosition({row:3, column:0});
            behavior.setTarget({row: 3,column: 7});

            behavior.on('nextMoveGenerated', function(result){
                var typeId = map.grid[result.row][result.column];
                AreaTypes[typeId].isWalkable.should.be.true;
                done();
            });

            behavior.getNextMove();
        });

        it('should be able to reach target', function(done){
            var behavior = new ChaseBehavior({
                sightRadius: 5
            });

            behavior.setMap(map);
            behavior.setPosition({row:3, column:0});
            var target = {row:3, column: 7};
            behavior.setTarget(target);

            function onNextMoveRetrieved(result){
                if(result.row == target.row && result.column == target.column)
                {
                    done();
                }
                else
                    behavior.getNextMove();
            }

            behavior.on('nextMoveGenerated', onNextMoveRetrieved);

            behavior.getNextMove();

        });




    })
});