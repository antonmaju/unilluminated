var nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

module.exports = {
    mongoServer :nconf.get('mongoServer'),
    mongoPort: parseInt(nconf.get('mongoPort'),10),
    mongoDatabase :nconf.get('mongoDatabase'),
    mongoUser :nconf.get('mongoUser'),
    mongoPassword :nconf.get('mongoPassword'),
    assetsUrl : nconf.get('assetsUrl'),
    webUrl : nconf.get('webUrl')
};