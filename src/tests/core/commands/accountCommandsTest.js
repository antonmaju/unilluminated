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

        });

        it('wont add empty id', function(done){


        });

        it('cant create duplicate id', function(done){

        });

        it('can add unique id', function(done){

        });
    });

});