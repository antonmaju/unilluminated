var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
    filters = coreServices.filters;

module.exports ={
    settings: {
        beforeFilters : [filters.authorize()]
    },

    index: {
        route: '/game/:id',
        method:'get',
        handler: function(req, resp, next){

            var model =controllerHelper.buildModel({}, req);
            resp.render('game/index', model);
        }
    }
};