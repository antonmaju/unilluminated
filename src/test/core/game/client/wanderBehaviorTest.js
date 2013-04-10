var testSettings = require('../../../testSettings');

var should = require('should'),
    WanderBehavior = require('../../../../core/game/client/wanderBehavior'),
    AreaTypes = require('../../../../core/game/areaTypes');

describe('WanderBehavior', function(){
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

            var behavior = new WanderBehavior({
                sightRadius: 5,
                isSingleMap: true
            });

            behavior.setPosition({row:2, column: 1})
            behavior.setMap(map);

            var result =behavior.getNextMove();
            //function(result){
            var typeId = map.grid[result.row][result.column];
            AreaTypes[typeId].isWalkable.should.be.true;
            done();
            //});

        });

//        it('should not move to end of area in single map mode', function(done){
//            var behavior = new WanderBehavior({
//                sightRadius: 5,
//                map:map,
//                row:1,
//                column: 1,
//                isSingleMap: true
//            })
//
//            var counter =0;
//
//            function onNextMoveRetrieved(result){
//                counter ++;
//                var typeId = map.grid[result.row][result.column];
//                typeId.should.not.equal('27');
//
//                if(counter < 50)
//                    behavior.getNextMove(onNextMoveRetrieved);
//                else
//                    done();
//            }
//
//            behavior.getNextMove(onNextMoveRetrieved);
//        });


//        it('should not return to original end of area in multi map mode', function(done){
//
//            var options = {
//                sightRadius: 5,
//                map:map,
//                row:1,
//                column: 1,
//                isSingleMap: false
//            };
//            var behavior = new WanderBehavior(options);
//
//            function onNextMoveRetrieved(result){
//                var typeId = map.grid[result.row][result.column];
//                if(typeId == '27'){
//                    (result.row != options.row || result.column != options.column).should.be.true;
//                    done();
//                }
//            }
//
//            behavior.getNextMove(onNextMoveRetrieved);
//        });
//
//
//        it('should aim to move to end of area in multi map mode', function(done){
//            var options = {
//                sightRadius: 5,
//                map:map,
//                row:1,
//                column: 1,
//                isSingleMap: false
//            };
//            var behavior = new WanderBehavior(options);
//
//            function onNextMoveRetrieved(result){
//                var typeId = map.grid[result.row][result.column];
//                if(typeId == '27'){
//                    done();
//                }
//            }
//            behavior.getNextMove(onNextMoveRetrieved);
//        });

    })
});