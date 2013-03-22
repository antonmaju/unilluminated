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
            gameCommands.getById(req.params.id, function(result){
                if(result.error || !result.doc)
                {
                    resp.redirect('/main-menu');
                    return;
                }

                var game = result.doc;
                controllerHelper.renderView('game/index',{
                    id: req.params.id,
                    userId: req.session.userId,
                    mode : game.mode
                }, req, resp);
            });


        }
    },
    create : {
        route : '/game/new/:mode(1p|2p)/:type(heroine|guardian)',
        method:'get',
        handler: function(req, resp, next){

            var game = {
                mode : req.params.mode,
                created : new Date(),
                players: {}
            };


            if(req.params.type == 'heroine'){
                game.players.girl = {
                    id : req.session.userId,
                    type : GameSystem.PlayerTypes.Girl,
                    direction: PlayerDirections.Left,
                    map : 'Map1'
                };
            }else{
                game.players.guardian = {
                    id: req.session.userId,
                    type: GameSystem.PlayerTypes.Guardian,
                    direction: PlayerDirections.Right,
                    map : 'Map7'
                };
            }

            gameCommands.create(game, function(result){
                if(result.error){
                    resp.redirect('/main-menu');
                    return;
                }
                resp.redirect('/game/'+result.doc._id.toString());
            });
        }
    }

};