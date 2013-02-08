
var config = require('../config'),
    htmlHelpers = require('./htmlHelpers');

/**
 * Wrap model passed with additional information
 * @param {Object} model
 * @param {Object} req
 */

exports.buildModel = buildModel = function(model, req){
    var locals = { model: model};
    locals.req = req;
    locals.config = config;
    locals.html = htmlHelpers;
    locals.errors = req.errors || [];
    return locals;
};

exports.renderView = function(view, model, req, resp){
    var locals = buildModel(model, req);
    resp.render(view, locals);
};