var testSettings = require('../../testSettings');

var should = require('should'),
    coreServices = require('../../../core/coreServices'),
    dbHelpers = coreServices.dbHelpers,
    config = coreServices.config,
    gameCommands = require('../../../core/commands/gameCommands'),
    testHelpers = require('./commandTestHelpers'),
    mongo = require('mongodb');


var collName = 'Game';

config.mongoDatabase = 'unilluminated-test';

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
            var player1= new mongo.ObjectID();
            var dummy = {mode:'1p', players:{guardian:player1}};
            gameCommands.create(dummy, function(cb){
                should.not.exist(cb.error);
                testHelpers.find(collName,  {players:{guardian:player1}}, function(cb2){
                    should.exist(cb2.docs);
                    done();
                });
            });
        });
    });


});