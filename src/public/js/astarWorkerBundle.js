(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process,global){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process,global){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return window.setImmediate;
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/core/game/client/astar.js",function(require,module,exports,__dirname,__filename,process,global){var ds=require('./ds'),
    AreaTypes = require('../areaTypes'),
    commonUtils = require('../commonUtils') ;

function ManhattanDistance(start, end){
    return Math.abs(end.row-start.row) + Math.abs(end.column-start.column);
};



function getPossiblePositions(grid, pos, widthSize, heightSize){
    var connections = [];

    if(commonUtils.isWalkableArea(grid, pos.row-1, pos.column, widthSize, heightSize))
        connections.push({row:pos.row-1, column:pos.column});

    if(commonUtils.isWalkableArea(grid, pos.row, pos.column-1, widthSize, heightSize))
        connections.push({row:pos.row, column:pos.column-1});

    if(commonUtils.isWalkableArea(grid, pos.row+1, pos.column, widthSize, heightSize))
        connections.push({row:pos.row+1, column:pos.column});

    if(commonUtils.isWalkableArea(grid, pos.row, pos.column+1, widthSize, heightSize))
        connections.push({row:pos.row, column:pos.column+1});

    return connections;
}

function stringifyPosition(pos){
    return ''+pos.row+','+pos.column;
}

function convertToPosition(posString){
    var arr = posString.split(',');
    return {row:parseInt(arr[0],10),column:parseInt(arr[1],10)};
}

function samePosition(pos1,pos2){
    return pos1.row==pos2.row && pos1.column == pos2.column;
}

function reconstructPath(cameFrom, current){
    var stringPos = current;
    if(cameFrom[stringPos]){
        var paths = reconstructPath(cameFrom, cameFrom[stringPos])
        return paths + ";" + stringPos;
    }
    else{
        return stringPos;
    }
}

function convertPathStringsToPositions(positions){
    var posList = positions.split(';');
    var points =[];
    for(var i=0; i<posList.length; i++){
        var pos = posList[i].split(',');
        points.push({row:parseInt(pos[0],10), column:parseInt(pos[1], 10)});
    }
    return points;
}

module.exports = function(grid, start, end, widthSize, heightSize){

    var heuristic = ManhattanDistance;
    var closedHash = {};
    var openSet = new ds.PriorityQueue();
    var openHash = {};

    var gScore ={};
    var fScore = {};
    var cameFrom = {};

    var stringPos = stringifyPosition(start);
    gScore[stringPos] = 0;
    fScore[stringPos] = heuristic(start,end);
    openSet.enqueue(stringPos, fScore[stringPos]);
    openHash[stringPos]=true;

    while(openSet.size() > 0){
        stringPos = openSet.dequeue().item;
        var current = convertToPosition(stringPos);
        openHash[stringPos] = false;

        if(samePosition(current, end))
            return convertPathStringsToPositions(reconstructPath(cameFrom,stringPos));

        closedHash[stringPos]=true;

        var positions = getPossiblePositions(grid, current,widthSize, heightSize);

        for(var i=0; i<positions.length; i++){
            var newPos = positions[i];
            var newStringPos = stringifyPosition(newPos);
            var newGScore = gScore[stringPos] + 1;

            if(closedHash[newStringPos] && newGScore >= gScore[newStringPos])
                continue;


            if(! openHash[newStringPos] || newGScore < gScore[newStringPos])
            {
                cameFrom[newStringPos] = stringPos;
                gScore[newStringPos] = newGScore;
                fScore[newStringPos]= newGScore + heuristic(newPos, end);

                if(! openHash[newStringPos])
                {
                    openSet.enqueue(newStringPos, fScore[newStringPos]);
                    openHash[newStringPos]=true;
                }
            }
        }
    }
    return null;
};
});

require.define("/core/game/client/ds.js",function(require,module,exports,__dirname,__filename,process,global){module.exports = (function(){

    var DS= {};

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
        enqueue : function(item, priority){
            this._items.push({item:item, priority: priority});
            this._heapifyUp(this._items.length -1);
        },
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
        size : function(){
            return this._items.length;
        }
    };

    DS.PriorityQueue = PriorityQueue;

    return DS;
})();
});

require.define("/core/game/areaTypes.js",function(require,module,exports,__dirname,__filename,process,global){module.exports ={
    '1': {
        desc : 'grass',
        srcKey : 'grass',
        isWalkable : true
    },
    '2': {
        desc: 'ground', ////cave ground
        srcKey: 'ground',
        isWalkable : true
    },
    '3': {
        desc: 'stone road',
        scrKey:'road',
        isWalkable : true
    },
    '4':{
        desc: 'water',
        srcKey: 'water',
        isWalkable : false
    },
    '5': {
        desc: 'flower on grass',
        srcKey: 'flower',
        bgKey: 'grass',
        isWalkable : true
    },
    '6': {
        desc: 'sign board on grass',
        srcKey: 'sign',
        bgKey: 'grass',
        isWalkable : false
    },
    '7':{
        desc: 'sign board on ground',
        srcKey: 'sign',
        bgKey: 'ground',
        isWalkable : false
    },
    '8': {
        desc: 'stone on grass',
        srcKey: 'stone',
        bgKey:'grass',
        isWalkable : false
    },
    '9':{
        desc: 'stone on ground',
        srcKey: 'stone',
        bgKey: 'ground',
        isWalkable : false
    },
    '10' : {
        desc: 'thick forest',
        srcKey: 'thick-forest',
        isWalkable : false
    },
    '11': {
        desc: 'tree',
        srcKey: 'tree',
        isWalkable : false
    },
    '12': {
        desc: 'grass road',
        srcKey: 'grass-road',
        isWalkable : true
    },
    '13': {
        desc: 'grass right edge',
        srcKey:'grass-right-edge',
        isWalkable : true
    },
    '14': {
        desc: 'grass left edge',
        srcKey:'grass-left-edge',
        isWalkable : true
    },
    '15': {
        desc: 'grass top edge',
        srcKey:'grass-top-edge',
        isWalkable : true
    },
    '16': {
        desc: 'grass bottom edge',
        srcKey: 'grass-bottom-edge',
        isWalkable : true
    },
    '17':{
        desc: 'bridge',
        srcKey: 'bridge',
        isWalkable : true
    },
    '18':{
        desc: 'top edge horizontal bridge',
        srcKey:'top-edge-horizontal-bridge',
        isWalkable : false
    },
    '19' : {
        desc:'bottom edge horizontal bridge',
        srcKey:'bottom-edge-horizontal-bridge',
        isWalkable : false
    },
    '20' : {
        desc:'left edge vertical bridge',
        srcKey:'left-edge-vertical-bridge',
        isWalkable : false
    },
    '21' : {
        desc:'right_edge_bridge',
        srcKey:'right-edge-bridge',
        isWalkable : false
    },
    '22' : {
        desc:'damaged bridge',
        srcKey:'damaged-bridge',
        isWalkable : false

    },
    '23' : {
        desc:'barrel on bridge',
        srcKey:'barrel',
        bgKey:'bridge',
        isWalkable : false
    },
    '24' : {
        desc: 'stone on bridge',
        srcKey:'stone',
        bgKey:'bridge',
        isWalkable : false
    },
    '25' : {
        desc: 'everlasting rose',
        scrKey:'everlasting-rose',
        isWalkable :false
    },
    '26' : {
        desc:'stalgmite on ground',
        srcKey:'stalagmite',
        bgKey:'ground',
        isWalkable : false
    },
    '27': {
        desc:'end of area',
        srcKey:'end-of-area',
        bgKey : 'grass-road',
        isWalkable : true
    },
    '28' : {
        desc: 'ground among grass',
        isWalkable : true
    },
    '29' :{
        desc: 'ground top edge',
        srcKey: 'ground-top-edge',
        isWalkable : true
    },
    '30': {
        desc: 'ground left edge',
        srcKey:'ground-left-edge',
        isWalkable : true
    },
    '31': {
        desc: 'ground bottom edge',
        srcKey:'ground-bottom-edge',
        isWalkable : true
    },
    '32':{
        desc: 'ground right edge',
        srcKey:'ground-right-edge',
        isWalkable : true
    },
    '33' : {
        desc: 'chasm',
        srcKey:'chasm',
        isWalkable : false
    },
    '34':{
        desc: 'barrel on ground',
        srcKey:'barrel',
        bgKey:'ground',
        isWalkable : false
    },
    '35': {
        desc: 'barrel on grass',
        srcKey:'barrel',
        bgKey:'grass',
        isWalkable : false
    },

    '36': {
        desc: 'tree1 on grass',
        srcKey:'tree1',
        bgKey:'grass',
        isWalkable : false
    },
    '37': {
        desc: 'tree2 on grass',
        srcKey:'tree2',
        bgKey:'grass',
        isWalkable : false
    },
    '38': {
        desc: 'tree3 on grass',
        srcKey:'tree3',
        bgKey:'grass',
        isWalkable : false
    },
    '39': {
        desc: 'plant1 on grass',
        srcKey:'plant1',
        bgKey:'grass',
        isWalkable : false
    },
    '40': {
        desc: 'plant2 on grass',
        srcKey:'plant2',
        bgKey:'grass',
        isWalkable : false
    },
    '41': {
        desc: 'plant3 on grass',
        srcKey:'plant3',
        bgKey:'grass',
        isWalkable : false
    },
    '42': {
        desc: 'plant4 on grass',
        srcKey:'plant4',
        bgKey:'grass',
        isWalkable : false
    },
    '43': {
        desc: 'wall1 on grass',
        srcKey:'wall1',
        bgKey:'grass'
    },
    '44':{
        desc: 'cave_cliff',
        srcKey:'cave-cliff',
        isWalkable:false
    },
    '45':{
        desc:'cave_edge4',
        srcKey:'cave-edge-bottom',
        bgKey:'ground',
        isWalkable:false
    },
    '46':{
        desc:'start of area',
        srcKey:'end-of-area',
        bgKey : 'grass-road',
        isWalkable : true
    }
};
});

require.define("/core/game/commonUtils.js",function(require,module,exports,__dirname,__filename,process,global){/***
 * Perform shallow copy of obj2 to obj1
 * @param obj1 copy target
 * @param obj2 object to be copied
 */

var AreaTypes = require('./areaTypes');

var merge =  function(obj1, obj2){
    if (obj1 && obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
    }
};

exports.extends = function(obj1, obj2, obj3){

    if(obj1 && obj2)
    {
        merge(obj1, obj2);
        if(obj3)
            merge(obj1, obj3);
    }

    return obj1;
};

exports.isWalkableArea = function(grid, row, column,widthSize, heightSize)
{
    var totalRow = grid.length;
    var totalColumn = grid[0].length;
    for(var i=row; i<row+widthSize; i++){
        if(i < 0 || i>= totalRow) return false;

        for(var j=column; j<column+heightSize; j++){
            if(j<0 || j>= totalColumn) return false;

            if(! AreaTypes[grid[i][j]].isWalkable)
                return false;
        }
    }

    return true;
};



});

require.define("/public/js/astarWorker.js",function(require,module,exports,__dirname,__filename,process,global){var astar = require('../../core/game/client/astar');


onmessage = function(evt){
    var data = evt.data;
    var path = astar(data.grid, data.start, data.end, data.widthSize, data.heightSize);

    postMessage(path);

};
});
require("/public/js/astarWorker.js");
})();
