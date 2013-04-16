module.exports = function(app){

    var childProcess = require('child_process');
    var path = require('path');
    var originalGameJs = path.join(path.dirname(process.mainModule.filename),'public/js/gameClient.js');
    var combinedGameJs = path.join(path.dirname(process.mainModule.filename),'public/js/gameClientBundle.js');

    childProcess.exec('browserify '+originalGameJs+ ' -o '+ combinedGameJs, function (error, stdout, stderr) {
        if(error)
        {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
    });

};