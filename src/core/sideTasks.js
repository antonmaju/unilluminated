module.exports = function(app){

    var childProcess = require('child_process');
    var path = require('path');

    var inputs = [
        path.join(path.dirname(process.mainModule.filename),'public/js/gameClient.js'),
        path.join(path.dirname(process.mainModule.filename),'public/js/astarWorker.js')
        ];

    var browserfyOutputs =[
        path.join(path.dirname(process.mainModule.filename),'public/js/gameClientBundle.js'),
        path.join(path.dirname(process.mainModule.filename),'public/js/astarWorkerBundle.js')
    ];

    var uglifyOutputs =[
        path.join(path.dirname(process.mainModule.filename),'public/js/gameClient.min.js'),
        path.join(path.dirname(process.mainModule.filename),'public/js/astarWorker.min.js')
    ];

    function reportError(error){
        if(error)
        {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
            return true;
        }
        return false;
    }

    for(var i=0; i<inputs.length; i++)
    {
        (function(index){
            childProcess.exec('browserify '+inputs[index]+ ' -o '+ browserfyOutputs[index], function (error, stdout, stderr) {
                if (reportError(error)) return;

                childProcess.exec('uglifyjs '+browserfyOutputs[index]+' -o '+uglifyOutputs[index], function(err2, stdout2, stderr2){
                    if (reportError(err2)) return;
                })
            });
        })(i);

    }

};