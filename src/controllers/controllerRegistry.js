/**
 * Register controllers
 * @param {Object} app
 */

exports.register = (function(){

    var homeController = require('./homeController');

    function registerController(app, controller){

        var settings = controller.settings;
        var beforeFilters  = settings ? settings.beforeFilters : null;
        var afterFilters = settings ? settings.afterFilters : null;

        for(var prop in controller){

            var action = controller[prop];

            if(! action.method || ! action.route || ! action.handler)
                continue;

            var pipeline = [];
            if(beforeFilters)
                pipeline.push.apply(pipeline, beforeFilters);
            if(action.beforeFilters)
                pipeline.push.apply(pipeline, action.beforeFilters);
            pipeline.push(action.handler);
            if(action.afterFilters)
                pipeline.push.apply(pipeline, action.afterFilters);
            if(afterFilters)
                pipeline.push.apply(pipeline, afterFilters);
            app[action.method](action.route, pipeline);
        }
    }

    function register(app){

        registerController(app, homeController);
    }

    return register;
})();