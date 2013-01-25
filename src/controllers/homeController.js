var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelper,
    filters = coreServices.filters;

module.exports = {
    index: {
        route: '/',
        method: 'get',
        handler: function(req, resp, next){
            var model =controllerHelper.buildModel({}, req);
            resp.render('home/index', model);
        }
    },
    main :{
        route :'/main-menu',
        method: 'get',
        handler: function(req, resp, next){
            var model = controllerHelper.buildModel({}, req);
            resp.render('home/main', model);
        }
    },
    selection: {
        route:'/selection/:mode',
        method: 'get',
        handler: function(req, resp, next){
            var model = controllerHelper.buildModel({mode:req.params.mode}, req);
            resp.render('home/selection', model);
        }
    }
};
