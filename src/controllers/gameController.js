var mongo=require('mongodb'),
    coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
    gameCommands = require('../core/commands/gameCommands'),
    GameStates = require('../core/game/gameStates'),
    GameSystem = require('../core/game/server/serverRegistry'),
    PlayerDirections = GameSystem.PlayerDirections,
    typeConverter = coreServices.typeConverter,
    filters = coreServices.filters;

function getCurrentUserId(req){
    var currentUserId = req.session.userId;

    if (typeof(currentUserId) == 'string')
        currentUserId = typeConverter.fromString.toObjectId(currentUserId);

    return currentUserId;
}



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
                var currentUserId = getCurrentUserId(req);
                var userFound = false;
                var userType = null;

                for(var type in game.players)
                {
                    var player = game.players[type];
                    if(player.id.toString() == currentUserId.toString())
                    {
                        userFound = true;
                        userType = player.type;
                        break;
                    }
                }

                if(! userFound)
                {
                    resp.redirect('/main-menu');
                    return;
                }

                if(game.state == GameStates.Finished)
                {
                    var model = {};

                    if(userType == GameSystem.PlayerTypes.Girl)
                    {
                        model.winner = game.winnerId.toString() == currentUserId.toString() ?
                        GameSystem.PlayerTypes.Girl : GameSystem.PlayerTypes.Guardian;
                    }
                    else
                    {
                        model.winner =game.winnerId.toString() == currentUserId.toString() ?
                            GameSystem.PlayerTypes.Guardian : GameSystem.PlayerTypes.Girl;
                    }

                    controllerHelper.renderView('game/game-over',model, req, resp);
                    return;
                }

                controllerHelper.renderView('game/index',{
                    id: req.params.id,
                    userId: currentUserId,
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
                state : GameStates.Running,
                players: {}
            };

            var isHeroine = req.params.type == 'heroine';
            var currentUserId = getCurrentUserId(req);

            if(game.mode == '1p')
            {
                game.players.girl = {
                    id :  isHeroine ? currentUserId : new mongo.ObjectID(),
                    type : GameSystem.PlayerTypes.Girl,
                    direction: PlayerDirections.Left,
                    map : 'Map1',
                    auto: !isHeroine,
                    trace: true
                };
                game.players.guardian ={
                    id:  isHeroine ? new mongo.ObjectID() :  currentUserId,
                    type: GameSystem.PlayerTypes.Guardian,
                    direction: PlayerDirections.Right,
                    map: 'Map7',
                    auto: isHeroine,
                    random: isHeroine
                };
            }
            else{

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