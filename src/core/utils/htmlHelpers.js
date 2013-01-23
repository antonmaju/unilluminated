var config = require('../config');

/***
 * Returns  link tags in HTML string
 * @param {Array}files Collection of relative css paths
 * @return {String} Link tags
 */
exports.cssLoader = function(files){
    if(!files)
        return '';

    var str ='';
    for(var i=0; i<files.length; i++)
    {
        str+='<link rel="stylesheet" type="text/css" href="';
        str+=config.assetsUrl;
        str+=files[i];
        str+='"/>';
    }
    return str;
};

/**
 * Return script tags in string
 * @param {Array} files  Collection od relative js path
 * @return {String} Script tags
 */
exports.jsLoader = function (files){
    if(! files)
        return '';

    var str ='';
    for(var i=0; i<files.length; i++)
    {
        str+='<script type="text/javascript" src="';
        str+=config.assetsUrl;
        str+=files[i];
        str+='"></script>';
    }
    return str;
}