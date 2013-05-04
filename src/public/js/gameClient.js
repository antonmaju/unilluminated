$(function(){
    var GameSystem = require('../../core/game/client/clientRegistry');

    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    var $container = $('#container');
    var $btnContainerAll = $('#btnContainerAll');
    var $btnContainerRight = $('#btnContainerRight');
    var $btnAct = $('#btnAct');
    var $btnDirectionUp = $('#btnDirectionUp');
    var $btnDirectionLeft = $('#btnDirectionLeft');
    var $btnDirectionRight = $('#btnDirectionRight');
    var $btnDirectionDown = $('#btnDirectionDown');
    var $btn = $('.btn');
    var widthRatio =4/3;

    var socket = io.connect(settings.webUrl);

    var game = new GameSystem.Game({
        context:context,
        socket: socket,
        id: settings.id,
        userId: settings.userId,
        mode: settings.mode
    });

    //TODO: refactor this
    function resizeController(){
        // Direction ratio default portrait
        var newWidth = window.innerWidth,
        newHeight = window.innerHeight,
        controllerRatio = 0.3 * newWidth,
        directionRatioHeight = 0.3,
        directionRatioWidth = 0.1,
        widthCR = 0.3 * newHeight,
        HeightCR = 0.3 * newHeight,
        padding1Ratio = 0,
        padding2Ratio = 0,
        padding1 = 0,
        padding2 = 0,
        horTop = 0,
        horLeft = 0,

        horWidthRatio = 0.35,
        horHeightRatio = 0.05,
        horWidth = 0,
        horHeight = 0,

        verTop = 0,
        verLeft = 0,
        verWidthRatio = 0.05,
        verWidth = 0,
        verHeightRatio = 0.35,
        verHeight = 0,

        btnSpace = 0,
        btnSpaceRatio = 0.08,
        btnContainerTop = 0,
        buffTop = 20,
        btnContainerLeft = 0;

        var crTop = 0,
        crLeft = 0,
        crWidth = 0;

        btnContainerTop = 0.65 * newHeight;
        btnContainerLeft = 0.05 * newWidth;
        controllerRatio = 0.3 * newHeight;
        if(newWidth > newHeight)
        {

            btnContainerTop = 0.55 * newHeight;
            btnContainerLeft = 0.05 * newWidth;
            controllerRatio = 0.4 * newHeight;
        }

        btnSpace = btnSpaceRatio * controllerRatio;
        verLeft = horWidth + btnSpace;
        verTop = verHeight + btnSpace * 2 + horHeight;
        horTop = verHeight + btnSpace;
        // horleft is for left margin of DirectionRight
        horLeft = verLeft + verWidth + btnSpace;
        $btnContainerAll.css('top',btnContainerTop + 'px').css('left',btnContainerLeft + 'px');
        verWidth = verWidthRatio * controllerRatio;
        verHeight = verHeightRatio * controllerRatio;
        horHeight = horHeightRatio * controllerRatio;
        horWidth = horWidthRatio * controllerRatio;
        verLeft = verHeight + btnSpace;
        padding1 = verWidth;
        padding2 = padding1 + 1;
        $btnDirectionUp.css('width',verWidth + 'px').css('height',verHeight + 'px').css('left',verLeft + 'px');
        verTop = verHeight + horHeight + 2 * btnSpace;
        $btnDirectionDown.css('width',verWidth + 'px').css('height',verHeight + 'px').css('left',verLeft + 'px').css('top',verTop + 'px');
        horTop = verHeight + btnSpace;
        $btnDirectionLeft.css('width',horWidth + 'px').css('height',horHeight + 'px').css('left',0 + 'px').css('top',horTop + 'px');
        horLeft = horWidth + verWidth + 2 * btnSpace;
        $btnDirectionRight.css('width',horWidth + 'px').css('height',horHeight + 'px').css('left',horLeft + 'px').css('top',horTop + 'px');
        $btn.css('padding', padding1 + 'px ' + padding2 + 'px');

        crTop = btnContainerTop + ( verHeight / 2 );
        crLeft = newWidth - btnContainerLeft - ( verHeight * 2.5 );
        crWidth = verHeight * 2;
        $btnContainerRight.css('top',crTop + 'px').css('left',crLeft + 'px');
        $btnAct.css('width',crWidth + 'px').css('height',crWidth + 'px');


    }
    //this resize function is from HTML5Rocks.com
    function resizeArea(){
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthRatio = newWidth / newHeight;

        if (newWidthRatio > widthRatio) {
            newWidth = newHeight * widthRatio;
            $container.css('height', newHeight + 'px').css('width', newWidth + 'px');

        } else { // window height is too high relative to desired game height
            newHeight = newWidth / widthRatio;
            $container.css('width',  newWidth + 'px').css('height', newHeight +'px');
        }

        $container.css('marginTop',  (-newHeight / 2)).css('marginLeft',(-newWidth / 2) + 'px');

        $(canvas).attr('width',newWidth).attr('height', newHeight);
        resizeController();
        game.resize();
    }

    $(window).resize(function(evt){
        resizeArea();
    }).bind('orientationchange', function(){
        resizeArea();
    });

    $container.show();
    resizeArea();
    game.emit('initializing');

});

