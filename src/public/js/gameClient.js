jQuery(function(){

    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    var $container = $('#container');
    var widthRatio =4/3;

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
    }


    $(window).resize(function(evt){
        resizeArea();
    }).bind('orientationchange', function(){
        resizeArea();
    });

    $container.show();
    resizeArea();

});