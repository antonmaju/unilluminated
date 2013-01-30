var commonUtils = require('./commonUtils');

exports.authorize = function(){

    return function(req, resp, next){

        if(! commonUtils.isAuthorized(req))
        {
            resp.redirect('/');
        }
        else
        {
            next();
        }
    }
};
