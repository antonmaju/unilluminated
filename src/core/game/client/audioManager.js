module.exports = (function(){

    /***
     * This class is responsible for managing audio assets
     * @constructor
     */

    function AudioManager(){

    }

    AudioManager.prototype = {
        enabled : true,
        _currentSound: null,
        _activeId :null,
        /**
         * Initializes this instance
         */
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

        /***
         * Plays audio assets with the specified id
         * @param {string} id
         */
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