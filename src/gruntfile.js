module.exports = function(grunt){

    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["public/stylesheets"]
                },
                files: {
                    "public/stylesheets/home.css": "public/stylesheets/home.less",
                    "public/stylesheets/ending.css":"public/stylesheets/ending.less",
                    "public/stylesheets/game.css":"public/stylesheets/game.less",
                    "public/stylesheets/site.css":"public/stylesheets/site.less"
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    cleancss: true
                },
                files: {
                    "public/stylesheets/home.css": "public/stylesheets/home.less",
                    "public/stylesheets/ending.css":"public/stylesheets/ending.less",
                    "public/stylesheets/game.css":"public/stylesheets/game.less",
                    "public/stylesheets/site.css":"public/stylesheets/site.less"
                }
            }
        },
        browserify: {
            client:{
                src:'public/js/gameClient.js',
                dest:'public/js/gameClientBundle.js'
            },
            webWorker:{
                src:'public/js/astarWorker.js',
                dest:'public/js/astarWorkerBundle.js'
            }
        },
        uglify:{
            client:{
                files: {
                    'public/js/gameClient.min.js': 'public/js/gameClientBundle.js',
                    'public/js/astarWorker.min.js': 'public/js/astarWorkerBundle.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['less','browserify','uglify']);

};