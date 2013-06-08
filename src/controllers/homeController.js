var coreServices = require('../core/coreServices'),
    controllerHelper = coreServices.controllerHelpers,
    filters = coreServices.filters,
    accountCommands = require('../core/commands/accountCommands');


module.exports = {
    /**
     * Renders index page (home/index)
     */
    index: {
        route: '/',
        method: 'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('home/index',{}, req, resp);
        }
    },
    /**
     * Renders main page (home/main)
     */
    main :{
        route :'/main-menu',
        method: 'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('home/main',{}, req, resp);
        }
    },
    /**
     * Renders selection page based on mode
     */
    selection: {
        route:'/selection/:mode(1p|2p)',
        method: 'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('home/selection',{mode:req.params.mode}, req, resp);
        }
    },
    /**
     * Renders register page
     */
    naming : {
        route : '/register',
        method: 'get',
        handler: function(req, resp, next){
            controllerHelper.renderView('home/register',{}, req, resp);
        }
    },
    /**
     * Validates registered data
     * if errors occurred render naming page with error in it
     */
    register: {
        route: '/register',
        method: 'post',
        handler: function(req, resp, next){
            var errors = [];
            var model = null;

            if(! req.body.name){
                errors.push({ message: 'Name is required'});
            }

            var  model = { name : req.body.name };

            if(errors.length >  0){
                req.errors = errors;
                controllerHelper.renderView('home/register',model, req, resp);
                return;
            }

            accountCommands.create(model, function(result){

                if(result.error) {
                    req.errors = [result.error];
                    controllerHelper.renderView('home/register',model, req, resp);
                    return;
                }

                req.session.name = req.body.name;
                req.session.userId = result.doc._id.toString();
                controllerHelper.renderView('home/main',{}, req, resp);

            });
        }
    }
};
