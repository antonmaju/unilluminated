module.exports = (function(){

    function ImageManager(){
        this.queue = [];
        this.cache = {};
        this.loadedAssets = 0;
        this.failedAssets = 0;
    }

    ImageManager.prototype = {
        queueItem : function(options){
            this.queue.push(options);
        },
        queueItems: function(items){
            if(! items)
                return;

            for(var i=0; i<items.length; i++)
            {
                this.queueItem(items[i]);
            }
        },
        isDownloading : function(){
            return this.queue.length > this.loadedAssets + this.failedAssets;
        },
        download: function(cb){
            var self = this;
            this.loadedAssets = 0;
            this.failedAssets = 0;
            for(var i=0; i<this.queue.length; i++){
                var img = new Image();
                img.addEventListener('load', function(assetData)
                {
                    return function(evt){
                        self.loadedAssets ++;
                        self.cache[assetData.key] = this;
                        if(! self.isDownloading() && cb)
                            cb();
                    }
                }(this.queue[i]));
                img.addEventListener('error', function(evt){

                    this.failedAssets ++;
                    if(! this.isDownloading() && cb)
                        cb();
                });
                img.src = this.queue[i].src;
            }
        },
        get: function(src){
            return this.cache[src];
        }
    };

    return ImageManager;
})();