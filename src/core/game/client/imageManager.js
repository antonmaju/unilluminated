module.exports = (function(){

    /**
     * ImageManager class provides a way to load image assets
     */
    function ImageManager(){
        this._queue = [];
        this._cache = {};
        this._loadedAssets = 0;
        this._failedAssets = 0;
    }

    ImageManager.prototype = {
        /**
         * Add a new item to download queue
         * @param options
         */
        queueItem : function(options){
            this._queue.push(options);
        },

        /**
         * Add arrays of item to download queue
         * @param items
         */
        queueItems: function(items){
            if(! items)
                return;

            this._queue.push.apply(this._queue, items);
        },
        /**
         * Checks whether now is downloading
         * @return {Boolean}
         */
        isDownloading : function(){
            return this._queue.length > this._loadedAssets + this._failedAssets;
        },
        /**
         * Downloads all images in queue
         * @param {function} cb
         */
        download: function(cb){
            var self = this;
            this._loadedAssets = 0;
            this._failedAssets = 0;
            for(var i=0; i<this._queue.length; i++){
                var img = new Image();
                img.addEventListener('load', function(assetData)
                {
                    return function(evt){
                        self._loadedAssets ++;
                        self._cache[assetData.key] = this;
                        if(! self.isDownloading() && cb)
                            cb();
                    }
                }(this._queue[i]));
                img.addEventListener('error', function(evt){

                    self._failedAssets ++;
                    if(! self.isDownloading() && cb)
                        cb();
                });
                img.src = this._queue[i].src;
            }
        },
        get: function(src){
            return this._cache[src];
        }
    };

    return ImageManager;
})();