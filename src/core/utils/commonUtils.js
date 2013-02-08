exports.isAuthorized = function(req){
    if(! req.session  || !req.session.name)
        return false;

    


    return true;
};