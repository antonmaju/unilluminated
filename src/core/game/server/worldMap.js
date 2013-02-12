module.exports = {
    Map1: {
        src: require('../maps/map1'),
        links:{
            'R':'Map2',
            'L' : '*'
        }
    },
    Map2: {
        src: require('../maps/map2'),
        links:{
            'R':'Map3',
            'B':'Map4',
            'L':'Map1'
        }
    },
    Map3: {
        src: require('../maps/map3'),
        links:{
            'L':'Map2',
            'T':'Map6',
            'R':'Map7'
        }
    },
    Map4: {
        src: require('../maps/map4'),
        links:{
            'T':'Map2',
            'R':'Map5'
        }
    },
    Map5: {
        src: require('../maps/map5'),
        links:{
            'L':'Map4',
            'R':'Map13'
        }
    },
    Map13: {
        src: require('../maps/map13'),
        links:{
            'L':'Map5',
            'R':'Map9'
        }
    },
    Map9: {
        src: require('../maps/map9'),
        links:{
            'L':'Map13',
            'B':'Map14'
        }
    },
    Map14: {
        src: require('../maps/map14'),
        links:{
            'T':'Map9'
        }
    },
    Map7: {
        src: require('../maps/map7'),
        links:{
            'L':'Map3',
            'R':'Map8'
        }
    },
    Map8: {
        src: require('../maps/map8'),
        links:{
            'L':'Map7',
            'T':'Map10',
            'R':'Map11'
        }
    },
    Map10: {
        src: require('../maps/map10'),
        links:{
            'B':'Map8'
        }
    },
    Map11: {
        src: require('../maps/map11'),
        links:{
            'L':'Map8'
        }
    }
};
