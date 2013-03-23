var testSettings = require('../../testSettings');

var should = require('should'),
    mongo = require('mongodb'),
    assert = require('assert'),
    worldMap = require('../../../core/game/server/worldMap'),
    gameCommands = require('../../../core/commands/gameCommands'),
    engineCommands = require('../../../core/commands/engineCommands');


describe('EngineCommands', function(){

    describe('#getInitialGameInfo()', function(){

        var originalFuncName = null;
        var originalFunc = null;

        beforeEach(function(){
            originalFuncName = null;
            originalFunc = null;
        });

        afterEach(function(){
            if(originalFunc){
                gameCommands[originalFuncName]= originalFunc;
            }
        });

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

            originalFunc = gameCommands.getById;
            originalFuncName = 'getById';

            var dummy = {
                players: {
                    girl: {id: new mongo.ObjectID(), direction :'R', map:'Map1',trace:true }
                }
            };

            gameCommands.getById = function(id, callback){
                callback({doc:dummy});
            };

            engineCommands.getInitialGameInfo({id: new mongo.ObjectID(), userId: dummy.players.girl.id}, function(result){
                should.exist(result.players);
                assert.equal(result.players.girl, dummy.players.girl);
                done();
            });

        });

        it('should return user map', function(done){
            originalFunc = gameCommands.getById;
            originalFuncName = 'getById';

            var dummy = {
                players: {
                    girl: {id: new mongo.ObjectID(), direction :'R', map:'Map1',trace:true }
                }
            };

            gameCommands.getById = function(id, callback){
                callback({doc:dummy});
            };

            engineCommands.getInitialGameInfo({id: new mongo.ObjectID(), userId: dummy.players.girl.id}, function(result){
                should.exist(result.maps);
                should.exist(result.maps.girl);
                assert.equal(result.maps.girl, worldMap[dummy.players.girl.map].src);
                gameCommands.getById = originalFunc;
                done();
            });

        });

    });

    describe('#getNewMapInfo', function(){

        var originalFuncName = null;
        var originalFunc = null;

        beforeEach(function(){
            originalFuncName = null;
            originalFunc = null;
        });

        afterEach(function(){
            if(originalFunc){
                gameCommands[originalFuncName]= originalFunc;
            }
        });

        it('requires game id', function(done){
            engineCommands.getNewAreaInfo({userId:new mongo.ObjectID(), direction: 'B'}, function(result){
                should.not.exist(result);
                done();
            });
        });

        it('requires user id', function(done){
            engineCommands.getNewAreaInfo({id: new mongo.ObjectID(), direction : 'B'}, function(result){
                should.not.exist(result);
                done();
            });
        });

        it('requires direction', function(done){
            engineCommands.getNewAreaInfo({ id: new mongo.ObjectID(), userId: new mongo.ObjectID()}, function(result){
                should.not.exist(result);
                done();
            });
        });

//        it('should return new user data', function(done){
//            originalFunc = gameCommands.getById;
//            originalFuncName = 'getById';
//
//            var dummy = {
//                players: {
//                    girl: {id: new mongo.ObjectID(), direction :'R', map:'Map2',trace:true }
//                }
//            };
//
//            gameCommands.getById = function(id, callback){
//                callback({doc:dummy});
//            };
//
//            engineCommands.getNewAreaInfo({
//                id: new mongo.ObjectID(),
//                direction : 'B',
//                userId: dummy.players.girl.id
//            }, function(result){
//                should.exist(result.players.girl);
//                assert.equal(result.players.girl.map, 'Map4');
//                done();
//            });
//        });
//
//        it('should return user new map', function(done){
//            originalFunc = gameCommands.getById;
//            originalFuncName = 'getById';
//
//            var dummy = {
//                players: {
//                    girl: {id: new mongo.ObjectID(), direction :'R', map:'Map2',trace:true }
//                }
//            };
//
//            gameCommands.getById = function(id, callback){
//                callback({doc:dummy});
//            };
//
//            engineCommands.getNewAreaInfo({
//                id: new mongo.ObjectID(),
//                direction : 'B',
//                userId: dummy.players.girl.id
//            }, function(result){
//                should.exist(result.players.maps.girl);
//                assert.equal(result.players.maps.girl, worldMap['Map4'].src);
//                done();
//            });
//        });
    });
});