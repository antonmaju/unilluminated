module.exports = {
    Map1: {
        src: require('../maps/map1'),
        links:{
            //'R':'Map2',
            'R':'Map72',
            'L' : '*'
        },
        guardianEncounter: 0,
        posList :[{row: 6,column:20, direction:'R' }]
    },
    Map2: {
        src: require('../maps/map2'),
        links:{
            'R':'Map73',
            'B':'Map4',
            'L':'Map1'
        },
        guardianEncounter: 5,
        posList :[{row: 6,column:10, direction:'R' }]
    },
    Map3: {
        src: require('../maps/map3'),
        links:{
            'L':'Map2',
            'T':'Map6',
            'R':'Map7'
        },
        guardianEncounter: 50,
        posList: [{row:6, column:23, direction:'R' }]
    },
    Map4: {
        src: require('../maps/map4'),
        links:{
            'T':'Map72',
            'R':'Map5'
        },
        guardianEncounter: 30,
        posList:[{row:9, column:4, direction:'R'}]
    },
    Map5: {
        src: require('../maps/map5'),
        links:{
            'L':'Map4',
            'R':'Map13'
        },
        guardianEncounter: 25,
        posList:[{row:36, column:1, direction:'R' }]
    },
    Map13: {
        src: require('../maps/map13'),
        links:{
            'L':'Map5',
            'R':'Map9'
        },
        guardianEncounter: 0
    },
    Map9: {
        src: require('../maps/map9'),
        links:{
            'L':'Map13',
            'B':'Map14'
        },
        guardianEncounter: 50,
        posList :[{row:1, column:25, direction:'L'}]
    },
    Map14: {
        src: require('../maps/map14'),
        links:{
            'T':'Map9'
        },
        guardianEncounter: 25,
        posList:[{row: 1, column:24 , direction:'R'}]
    },
    Map7: {
        src: require('../maps/map7'),
        links:{
            'L':'Map73',
            'R':'Map8'
        },
        guardianEncounter:100,
        posList:[{row:21 , column:17, direction:'R'}]
    },
    Map8: {
        src: require('../maps/map8'),
        links:{
            'L':'Map77',
            'T':'Map10',
            'R':'Map11'
        },
        guardianEncounter: 45,
        posList :[{row:3 , column: 0, direction:'R'}]
    },
    Map10: {
        src: require('../maps/map10'),
        links:{
            'B':'Map8'
        },
        guardianEncounter: 60,
        posList :[{row:1 , column: 5, direction:'L'}]
    },Map6: {
        src: require('../maps/map6'),
        links:{
            'B':'Map73'
        },
        guardianEncounter: 25,
        posList :[{row:3, column:0, direction:'R'}]
    },
    Map11: {
        src: require('../maps/map11'),
        links:{
            'L':'Map8'
        }
    },
    /*new map*/
    Map72: {
        src: require('../maps/map72'),
        links:{
            'R':'Map73',
            'B':'Map4',
            'L':'Map1'
        },
        guardianEncounter: 5,
        posList :[{row: 5,column:2, direction:'B' }]
    },
    Map73: {
        src: require('../maps/map73'),
        links:{
            'L':'Map72',
            'T':'Map6',
            'R':'Map77'
        }
    }, Map77: {
        src: require('../maps/map77'),
        links:{
            'L':'Map73',
            'R':'Map8'
        }
        ,guardianEncounter:100,
        posList : [{row: 0, column:15, direction:'B' }]
    },
    Map15: {
        src: require('../maps/map15'),
        links:{
            'T':'Map11'
        },
        guardianEncounter: 80,
        posList:[{row: 1, column:5 , direction:'L'}]
    },
    Map12: {
        src: require('../maps/map12'),
        links:{
            'L':'Map11'
        },
        guardianEncounter: 80,
        posList:[{row: 1, column:36 , direction:'R'}]
    }
};
