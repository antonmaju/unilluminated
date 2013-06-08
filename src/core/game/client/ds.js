module.exports = (function(){

    var DS= {};

    /***
     * This class uses min-heap tree, needed by A* for storing its open set
     * @constructor
     */
    function PriorityQueue(){
        this._items = [];
    }

    PriorityQueue.prototype = {
        _swap : function(index1, index2){
            var temp = this._items[index1];
            this._items[index1]= this._items[index2];
            this._items[index2]= temp;
        },
        _heapifyUp: function(index){
            var currentIndex = index;
            while(currentIndex > 0){
                var parentIndex = Math.floor((currentIndex -1)/2);
                var parentItem = this._items[parentIndex];
                if(parentItem.priority <= this._items[currentIndex].priority)
                    break;
                this._swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            }
        },
        _heapifyDown : function(index){
            var length = this._items.length;
            if(index >= length) return;

            var currentIndex = index;
            while(true){
                var smallestIndex = currentIndex;
                var leftIndex = 2 * currentIndex + 1;
                var rightIndex = 2 * currentIndex + 2;

                if(leftIndex < length &&  this._items[smallestIndex].priority > this._items[leftIndex].priority)
                    smallestIndex = leftIndex;
                if(rightIndex < length &&  this._items[smallestIndex].priority > this._items[rightIndex].priority)
                    smallestIndex = rightIndex;
                if(smallestIndex != currentIndex)
                {
                    this._swap(currentIndex, smallestIndex);
                    currentIndex = smallestIndex;
                }
                else break;
            }
        },
        /**
         * Adds new item to queue
         * @param {object} item
         * @param {int} priority
         */
        enqueue : function(item, priority){
            this._items.push({item:item, priority: priority});
            this._heapifyUp(this._items.length -1);
        },
        /***
         * Removes item in front position
         * @returns {object}
         */
        dequeue : function(){
            var length = this._items.length;
            if(length == 0) return null;

            var frontItem = this._items[0];
            var lastItem = this._items[length-1];
            this._items[0] = lastItem;
            this._items.pop();
            this._heapifyDown(0);
            return frontItem;
        },
        /**
        * Gets queue size
        */
        size : function(){
            return this._items.length;
        }
    };

    DS.PriorityQueue = PriorityQueue;

    return DS;
})();