var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
    gameCommands = require('../core/commands/gameCommands'),
    GameSystem = require('../core/game/server/serverRegistry'),
    filters = coreServices.filters;


module.exports ={
    settings: {
        beforeFilters : [filters.authorize()]
    },

    index: {
        route: '/game/:id',
        method:'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('game/index',{}, req, resp);

        }
    },
    create : {
        route : '/game/new/:mode(1p|2p)/:type(heroine|guardian)',
        method:'get',
        handler: function(req, resp, next){

            var game = {
                mode : req.params.mode,
                player1 : req.session.id,
                player1Type: req.params.type == 'heroine' ?
                    GameSystem.PlayerTypes.Girl : GameSystem.PlayerTypes.Guardian,
                created : new Date()
            };

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