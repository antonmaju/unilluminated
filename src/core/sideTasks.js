module.exports = function(app){

    var childProcess = require('child_process');

    childProcess.exec('browserify  public/js/gameClient.js -o public/js/gameClientBundle.js', function (error, stdout, stderr) {
        if(error)
        {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
    });

};