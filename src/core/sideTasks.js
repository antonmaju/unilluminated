module.exports = function(app){

    var childProcess = require('child_process');
    var path = require('path');
    var originalJs = path.join(path.dirname(process.mainModule.filename),'public/js/gameClient.js');
    var combinedJs = path.join(path.dirname(process.mainModule.filename),'public/js/gameClientBundle.js');

    childProcess.exec('browserify '+originalJs+ ' -o '+ combinedJs, function (error, stdout, stderr) {
        if(error)
        {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
    });

};