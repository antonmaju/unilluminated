var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
    gameCommands = require('../core/commands/gameCommands'),
    GameSystem = require('../core/game/server/serverRegistry'),
    PlayerDirections = GameSystem.PlayerDirections,
    filters = coreServices.filters;


module.exports ={
    settings: {
        beforeFilters : [filters.authorize()]
    },

    index: {
        route: '/game/:id',
        method:'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('game/index',{id: req.params.id, userId: req.session.userId}, req, resp);
        }
    },
    create : {
        route : '/game/new/:mode(1p|2p)/:type(heroine|guardian)',
        method:'get',
        handler: function(req, resp, next){

            var game = {
                mode : req.params.mode,
                created : new Date()
            };

            if(req.params.type == 'heroine'){
                game.player1 = {
                    id : req.session.userId,
                    type : GameSystem.PlayerTypes.Girl,
                    direction: PlayerDirections.Right,
                    map : 'Map1'
                };
            }else{
                game.player1 = {
                    id: req.session.userId,
                    type: GameSystem.PlayerTypes.Guardian,
                    direction: PlayerDirections.Left,
                    map : 'Map7'
                };
            }

            gameCommands.create(game, function(result){
                if(result.error){
                    req.errors = [result.error];
                    controllerHelper.renderView('home/main', {}, req, resp);
                    return;
                }
                resp.redirect('/game/'+result.doc._id.toString());
            });
        }
    }

};