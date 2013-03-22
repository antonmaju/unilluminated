var nconf = require('nconf'), path = require('path');

var configPath = path.join(__dirname,'../testConfig.json');

module.exports = nconf.argv().env().file({ file: configPath });

