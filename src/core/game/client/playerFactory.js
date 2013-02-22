module.exports = (function(){

    var PlayerTypes = require('../playerTypes'),
        Directions = require('../playerDirections'),
        Player = require('./player');


    var factory ={
        create: function(options){
            var imageKeys = {};
            var widthSize= 1;
            var heightSize=1;
            var sightRadius =10;

            switch(options.playerType)
            {
                case PlayerTypes.Girl:
                    imageKeys[Directions.Top] = 'girl-back';
                    imageKeys[Directions.Bottom] = 'girl-front';
                    imageKeys[Directions.Left] = 'girl-left';
                    imageKeys[Directions.Right] = 'girl-right';
                    sightRadius =3;
                    break;

                case PlayerTypes.Guardian:
                    imageKeys[Directions.Top] = 'monster-back';
                    imageKeys[Directions.Bottom] = 'monster-front';
                    imageKeys[Directions.Left] = 'monster-left';
                    imageKeys[Directions.Right] = 'monster-right';
                    widthSize = 2;
                    heightSize =2;

                    break;
            }

            return new Player({
                widthSize: widthSize,
                heightSize: heightSize,
                imageKeys: imageKeys,
                imageManager: options.imageManager,
                mapRenderer: options.mapRenderer,
                playerType: options.playerType,
                context: options.context,
                camouflageKey: 'stone',
                sightRadius : sightRadius,
                playerId:options.playerId
            });
        }
    };

    return factory;

})();