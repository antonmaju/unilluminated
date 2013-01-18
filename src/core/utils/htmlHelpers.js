var config = require('../config');

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