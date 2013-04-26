module.exports = AudioManager = {

    enabled : true,
    init : function(){
        var files = [{
            id:'harp',
            url:'/music/harp.ogg'
        },{
            id:'dissonant',
            url:'/music/dissonantwaltz.ogg'
        }];

        for(var i=0; i<files.length; i++)
        {
            soundManager.createSound(files[i]);
        }
    },

    play: function(id){
        if(! AudioManager.enabled) return;

        function playLoop(){
            soundManager.play(id, {
                onfinish: playLoop
            });
        }

        playLoop();
    }
};