var should = require('should'),
    mongo = require('mongodb'),
    gameCommands = require('../../core/commands/gameCommands'),
    gameController = require('../../controllers/gameController');


describe('gameController', function(){

    var req, resp;

    var nextTriggered = false;

    function next(){
        nextTriggered = true;
    }

    beforeEach(function(done){
        req = {
            params : {},
            session:{
                userId : new mongo.ObjectID().toString()
            }

        };

        resp = {

            redirect : function(url){
                resp.url = url;
            },

            render : function(view, model){
                resp.view = view;
                resp.locals = model;
            }
        };



        nextTriggered = false;
        done();
    });

    describe('create.handler', function(){





        it('should redirect to main menu if failed to create new game', function(done){
            req.params.mode='1p';
            req.params.type='heroine';

            gameCommands.create = function(game, result){
                result({
                    error : {message:'error'}
                });
            };


            gameController.create.handler(req, resp, next);
            resp.url.should.equal('/main-menu');
            done();

        });

        it('redirect to game page after create new game record', function(done){

            req.params.mode='1p';
            req.params.type='heroine';
            var id = new mongo.ObjectID();

            gameCommands.create = function(game, result){
                result({
                    doc :{
                        _id: id
                    }
                });
            };

            gameController.create.handler(req, resp, next);
            resp.url.should.equal('/game/'+id.toString());
            done();
        });
    });


    describe('index.handler', function(){

        it('should redirect to main menu if id is invalid', function(done){
            var id = new mongo.ObjectID();
            req.params.id = id.toString();

            gameCommands.getById = function(game, result){
                result({ });
            };

            gameController.index.handler(req, resp, next);
            resp.url.should.equal('/main-menu');
            done();

        });

        it('render page if data found', function(done){
            var id = new mongo.ObjectID();
            req.params.id = id.toString();

            gameCommands.getById = function(game, result){
                result({
                doc:{
                    id  :id,
                    mode: 1
                }});
            };

            gameController.index.handler(req, resp, next);
            resp.view.should.equal('game/index');

            done();
        });

    });
});
