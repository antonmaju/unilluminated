module.exports = (function(){

    function AudioManager(){

    }

    AudioManager.prototype = {
        enabled : true,
        _currentSound: null,
        _activeId :null,
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
            if(! this.enabled) return;

            var self = this;

            function playLoop(){
                if(id != self._activeId){
                    return;
                }

                self._currentSound = soundManager.play(id, {
                    onfinish: playLoop
                });
            }

            self._activeId = id;
            if(self._currentSound) self._currentSound.stop();
            playLoop();
        }
    };

    return AudioManager;

})();