var testSettings = require('../../testSettings');

var should = require('should'),
    coreServices = require('../../../core/coreServices'),
    dbHelpers = coreServices.dbHelpers,
    config = coreServices.config,
    gameCommands = require('../../../core/commands/gameCommands'),
    testHelpers = require('./commandTestHelpers'),
    mongo = require('mongodb');


var collName = 'Game';

config.sessionStore  = "mongo";
config.socketIoStore  = "memory";
config.mongoServer   = '127.0.0.1';
config.mongoPort     = 27017;
config.mongoDatabase = "unilluminated-test";
config.assetsUrl     = "http://localhost:3000";
config.webUrl        = "http://localhost";
config.sessionSecret = "your session secret";

describe('GameCommands', function(){

    describe('#create()', function(){
        beforeEach(function(done){
            testHelpers.clear(collName, done);
        });

        it('wont add game without mode', function(done){
            gameCommands.create({players:{girl:new mongo.ObjectID()}},function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('wont add game without player', function(done){
            gameCommands.create({mode:'1p'}, function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('can add game', function(done){
            var player1= {id:new mongo.ObjectID()};
            var dummy = {mode:'1p', players:{guardian:player1}};
            gameCommands.create(dummy, function(cb){
                should.not.exist(cb.error);
                testHelpers.find(collName,  {players:{guardian:{id: player1.id}}}, function(cb2){
                    should.exist(cb2.docs);
                    done();
                });
            });
        });

    });

    describe('#save()', function(){
        beforeEach(function(done){
            testHelpers.clear(collName, done);
        });

        it('wont save game without _id', function(done){
            gameCommands.save({
                mode:'1p',
                players:{girl:new mongo.ObjectID()}
            },function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('wont save game without mode', function(done){
            gameCommands.save({
                _id: new mongo.ObjectID(),
                players:{girl:new mongo.ObjectID()}
            },function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('wont add game without players', function(done){
            gameCommands.save({
                _id: new mongo.ObjectID(),
                mode:'1p'
            }, function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('can save game', function(done){
            var player1= {id: new mongo.ObjectID()};
            var dummy = {mode:'1p', players:{guardian:player1}};

            testHelpers.create(collName, dummy, function(cb1){
                dummy._id = cb1.doc._id;

                gameCommands.save(dummy, function(cb2){
                    should.not.exist(cb2.error);
                    dummy.players.guardian.map ='Map3';
                    testHelpers.find(collName,  {players:{guardian:{map:'Map3'}}}, function(cb3){
                        should.exist(cb3.docs);
                        done();
                    });
                });
            });
        });
    });


});