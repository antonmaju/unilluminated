var should = require('should'),
    coreServices = require('../../../core/coreServices'),
    dbHelpers = coreServices.dbHelpers,
    config = coreServices.config,
    accountCommands = require('../../../core/commands/accountCommands'),
    testHelpers = require('./commandTestHelpers');

var collName = 'Account';

config.mongoDatabase = 'unilluminated-test';

describe('AccountCommands', function(){

    describe('#create()', function(){

        beforeEach(function(done){
            testHelpers.clear(collName, done);
        });

        it('wont add empty user name', function(done){
            accountCommands.create({},function(cb){
                should.exist(cb.error);
                done();
            });
        });

        it('cant create duplicate user name', function(done){
            var dummy = {name: 'ozma'};
            testHelpers.create(collName, dummy, function(cb1){
                accountCommands.create(dummy, function(cb2){
                    should.exist(cb2.error);
                    testHelpers.find(collName, {name:dummy.name}, function(cb3){
                        cb3.docs.length.should.equal(1);
                        done();
                    });
                });
            });

        });

        it('can add unique user name', function(done){
            var dummy = {name:'jake'};
            accountCommands.create(dummy, function(cb){
                should.not.exist(cb.error);
                testHelpers.find(collName, {name:dummy.name}, function(cb2){
                    should.exist(cb2.docs);
                    done();
                });
            });
        });
    });

    describe('#delete()', function(){
        it('can delete by name', function(done){
            var dummy = {name: 'ozma'};
            testHelpers.create(collName, dummy, function(cb1){
                accountCommands.delete(dummy.name, function(cb2){
                    should.not.exist(cb2.error);
                    testHelpers.find(collName, {name:dummy.name}, function(cb3){
                        cb3.docs.length.should.equal(0);
                        done();
                    });
                });
            });
        });
    });
});