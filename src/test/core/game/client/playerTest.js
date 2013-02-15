var should = require('should'),
    Player = require('../../../../core/game/client/player.js');

describe('Player', function(){

    describe('canWalk()', function(){

        var dummyMap ={
            id  :'map1',
            grid:[
                [38,38,38,38],
                [12,12,12,38],
                [38,12,12,38],
                [38,38,12,38]
            ],
            exits :[
                {
                    'L': [{
                        row:1,
                        column:0
                    }],
                    'R': [{
                        row: 3,
                        column: 2
                    }]
                }
            ]

        };

        it('returns false if position is out of top border', function(){

            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(-1,0).should.equal(false);

        });

        it('returns false if position is out of right border', function(){

            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(4,0).should.equal(false);

        });

        it('returns false if position is out of bottom border', function(){
            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(0,4).should.equal(false);
        });

        it('returns false if position is out of left border', function(){
            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(0,-1).should.equal(false);
        });

        it('returns false if there is obstacle',function(){
            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(0,0).should.equal(false);
        });

        it('returns true if there isnt any obstacle', function(){
            var player = new Player({

            });
            player.setMap(dummyMap);
            player.canWalk(1,1).should.equal(true);

        });

    });

});