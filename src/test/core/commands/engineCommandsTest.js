var testSettings = require('../../testSettings');

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
                players: {
                    girl: {id: new mongo.ObjectID(), direction :'R', map:'Map1'}
                }
            };

            gameCommands.getById = function(id, callback){
                callback({doc:dummy});
            };

            engineCommands.getInitialGameInfo({id: new mongo.ObjectID(), userId: dummy.players.girl.id}, function(result){
                should.exist(result.players);
                assert.equal(result.players.girl, dummy.players.girl);
                gameCommands.getById = originalFunc;
                done();
            });

        });
    });
});