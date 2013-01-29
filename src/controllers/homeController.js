var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
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
        route:'/selection/:mode(1p|2p)',
        method: 'get',
        handler: function(req, resp, next){
            var model = controllerHelper.buildModel({mode:req.params.mode}, req);
            resp.render('home/selection', model);
        }
    },
    naming : {
        route : '/naming/:mode(1p|2p)/:char(heroine|guardian)',
        method: 'get',
        handler: function(req, resp, next){
            var model = controllerHelper.buildModel({
                mode : req.params.mode,
                char : req.params.heroine
            }, req);
            resp.render('home/naming',model);
        }
    },
    register: {
        route: '/naming/:mode(1p|2p)/:char(heroine|guardian)',
        method: 'post',
        handler: function(req, resp, next){
            var errors = [];
            var model = null;

            if(! req.body.name){
                errors.push({ message: 'Name is required'});
            }

            console.log(errors.length);
            if(errors.length >  0){
                req.errors = errors;
                model = controllerHelper.buildModel({
                    name: req.body.name,
                    mode:req.params.mode
                }, req);
                resp.render('home/naming', model);
                return;
            }

            model = controllerHelper.buildModel({
                name: req.body.name,
                mode:req.params.mode
            }, req);

            resp.render('home/naming', model);
        }
    }
};
