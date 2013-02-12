var should = require('should'),
    mongo = require('mongodb'),
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


    });


});