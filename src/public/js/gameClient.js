$(function(){
    var GameSystem = require('../../core/game/client/clientRegistry');
    var viewManager =  new GameSystem.ViewManager();
    var imageManager = new GameSystem.ImageManager();


    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    var mapRenderer = new GameSystem.MapRenderer({
        imageManager: imageManager,
        context: context
    });

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
        viewManager : viewManager,
        imageManager : imageManager,
        context:context,
        socket: socket,
        mapRenderer: mapRenderer,
        id: settings.id,
        userId: settings.userId,
        mode: settings.mode
    });

    //this resize function is from HTML5Rocks.com
    function resizeArea(){
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthRatio = newWidth / newHeight;
        var padd1= 7;
        var padd2= 8;
        var horTop=0;
        var horLeft=0;
        var horWidth=20;
        var horHeight=5;

        var verTop=0;
        var verLeft=0;
        var verWidth=5;
        var verHeight=20;
        var btnSpace=15;
        var btnContainerTop=0;
        var buffTop=20;
        var btnContainerLeft=0;
        var outWidth=window.outerWidth;
        var outHeight=window.outerHeight;
        var crTop=0;
        var crLeft=0;
        var crWidth=0;
//        if((outWidth > outHeight) && (outHeight<=320))
//        {
//
//            //btnContainerLeft=0;
//        }

        if(outWidth > 480 && newHeight > 320)
        {
//            alert('480+');
            padd1=8;
            padd2=11;
            verWidth=8;
            verHeight=40;
            horWidth=40;
            horHeight=8;
            btnSpace=17;
            btnContainerLeft=10;
            buffTop=40;
            //if()

        }
        if(outWidth > 800 && newHeight > 500) {
//            alert('800+');
            padd1=10;
            padd2=15;
            verWidth=10;
            verHeight=55;
            horWidth=55;
            horHeight=10;
            btnSpace=20;
            buffTop=100;
        }
//        alert(mapRenderer._startRow);
//        alert(mapRenderer.gridSize);
        btnContainerTop = newHeight-(buffTop+verHeight*2+horHeight*2+btnSpace*2);
        crTop=btnContainerTop+btnSpace*2;
        crLeft=newWidth-3*verHeight;
        crWidth=2*verHeight;

        if (newWidthRatio > widthRatio) {
            newWidth = newHeight * widthRatio;
            $container.css('height', newHeight + 'px').css('width', newWidth + 'px');

        } else { // window height is too high relative to desired game height
            newHeight = newWidth / widthRatio;
            $container.css('width',  newWidth + 'px').css('height', newHeight +'px');
        }

//        alert(newWidth);
//        alert(newHeight);
        verLeft=horWidth+btnSpace;
        verTop=verHeight+btnSpace*2+horHeight;
        horTop=verHeight+btnSpace;
        /* horleft is for left margin of DirectionRight*/
        horLeft=verLeft+verWidth+btnSpace;
        $container.css('marginTop',  (-newHeight / 2)).css('marginLeft',(-newWidth / 2) + 'px');
        $btnContainerAll.css('display','block').css('top',btnContainerTop + 'px').css('left',btnContainerLeft + 'px');
        $btnContainerRight.css('display','block').css('top',crTop + 'px').css('left',crLeft + 'px');
        $btnAct.css('width',crWidth + 'px').css('height',crWidth + 'px');
        $btnDirectionUp.css('width',verWidth + 'px').css('height',verHeight + 'px').css('left',verLeft + 'px');
        $btnDirectionDown.css('width',verWidth + 'px').css('height',verHeight + 'px').css('top', verTop + 'px').css('left',verLeft + 'px');
        $btnDirectionLeft.css('width',horWidth + 'px').css('height',horHeight + 'px').css('top', horTop + 'px').css('left',0 + 'px');
        $btnDirectionRight.css('width',horWidth + 'px').css('height',horHeight + 'px').css('top', horTop + 'px').css('left',horLeft + 'px');
        $btn.css('padding', padd1 + 'px ' + padd2 + 'px');
        $(canvas).attr('width',newWidth).attr('height', newHeight);

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

