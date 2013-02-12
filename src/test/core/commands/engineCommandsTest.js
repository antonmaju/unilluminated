var should = require('should'),
    mongo = require('mongodb'),
    assert = require('assert'),
    gameCommands = require('../../../core/commands/gameCommands'),
    engineCommands = require('../../../core/commands/engineCommands');


describe('EngineCommands', function(){

    describe('#getInitialGameInfo()', function(){


        it('should need id', function(done){
            engineCommands.getInitialGameInfo({userId:new mongo.ObjectID()},function(result){
                should.not.exist(result);
                done();
            });
        });

        it('should need userId', function(done){
            engineCommands.getInitialGameInfo({id: new mongo.ObjectID()},function(result){
                should.not.exist(result);
                done();
            });
        });

        it('should return player data', function(done){

            var originalFunc = gameCommands.getById;

            var dummy = {
                player1: {id: new mongo.ObjectID(), direction :'R', map:'Map1'}
            };

            gameCommands.getById = function(id, callback){
                callback({doc:dummy});
            };

            engineCommands.getInitialGameInfo({id: new mongo.ObjectID(), userId: dummy.player1.id}, function(result){
                should.exist(result.player);
                assert.equal(result.player.map, dummy.player1.map);
                gameCommands.getById = originalFunc;
                done();
            });

        });

    });
});