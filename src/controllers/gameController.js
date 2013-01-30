var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers;

module.exports ={
    index: {
        route: '/game/:id',
        method:'get',
        handler: function(req, resp, next){

            var model =controllerHelper.buildModel({}, req);
            resp.render('game/index', model);
        }
    }
};