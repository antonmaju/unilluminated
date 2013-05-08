/**
 * This object contains all possible area types
 */
module.exports ={
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
        srcKey:'cave-edge4',
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