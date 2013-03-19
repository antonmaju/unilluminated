var should = require('should'),
    PlayerActions = require('../../../../core/game/playerActions'),
    InputBuffer= require('../../../../core/game/client/inputBuffer');

describe('InputBuffer', function(){

    var interval =100;

    it('should trigger input directly if it is empty buffer', function(done){

        var trigerred = false;
        var input = 0;
        var buffer = new InputBuffer(interval);
        buffer.on('inputPublished', function(ipt){
            trigerred = true;
            input = ipt;
        });
        buffer.addInput(PlayerActions.MoveRight);
        trigerred.should.equal(true);
        input.should.equal(PlayerActions.MoveRight);
        done();
    });

    it('should trigger input in order', function(done){
        var expectedInputs= [PlayerActions.MoveRight, PlayerActions.Hide, PlayerActions.MoveLeft];
        var actualInputs = [];

        var buffer= new InputBuffer(interval);
        buffer.on('inputPublished', function(ipt){
            actualInputs.push(ipt);
        });

        setTimeout(function(){
            for(var i=0; i<actualInputs.length; i++){
                actualInputs[i].should.equal(expectedInputs[i]);
            }
            done();
        }, (expectedInputs.length + 1) * interval);

    });

})
