module.exports = function(grunt) {

    grunt.initConfig({

        // JS TASKS ================================================================
        // check all js files for errors
        jshint: {
            options: {
                smarttabs: true
            },
            all: ['public/js/**/*.js', '!public/js/libs/*.js']
        },

        // take all the js files and minify them into app.min.js
        uglify: {
            options: {
                mangle: false
            },
            build: {
                files: {
                    'public/dist/js/app.min.js': [
                        'public/libs/jquery/dist/jquery.js',
                        'public/libs/angular/angular.js',
                        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
                        'public/libs/angular-loading-bar/build/loading-bar.js',
                        'public/libs/angular-sanitize/angular-sanitize.js',
                        'public/libs/angular-ui-router/release/angular-ui-router.js',
                        'public/libs/angular-ui-select/dist/select.js',
                        'public/libs/lodash/dist/lodash.js',
                        'public/libs/restangular/dist/restangular.js',
                        'public/libs/angular-utils-pagination/dirPagination.js',
                        'public/libs/angular-dialog-service/dist/dialogs.min.js',
                        'public/libs/angulartics/dist/angulartics.min.js',
                        'public/libs/angulartics/dist/angulartics-ga.min.js',
                        'public/libs/angular-ui-grid/ui-grid.js',
                        'public/libs/ng-tags-input/ng-tags-input.js',
                        'public/libs/angular-bootstrap-toggle-switch/angular-toggle-switch.min.js',
                        'public/libs/nsPopover/src/nsPopover.js',
                        'public/libs/ngdropover/src/dropover.js',
                        'public/libs/angular-animate/angular-animate.js',
                        'public/libs/angular-aria/angular-aria.js',

                        'public/libs/angular-material/angular-material.js',
                        'public/libs/ui-grid-draggable-rows/js/draggable-rows.js',

                        'public/js/**/*.js',
                        'public/js/*.js'
                    ]
                }
            }
        },

        // CSS TASKS ===============================================================
        // process the less file to style.css
        less: {
            build: {
                files: {
                    'public/dist/css/style.css': [
                        'public/css/less/*.less',
                        'public/css/less/toggle-switch/angular-toggle-switch-bootstrap-3.less',
                        'public/libs/nsPopover/less/ns-popover.less',
                    ]
                }
            }
        },

        // take the processed style.css file and minify
        cssmin: {
            build: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'public/dist/css/style.min.css': [
                        'public/libs/fontawesome/css/font-awesome.css',
                        'public/css/libs/select2.css',
                        'public/libs/angular-loading-bar/build/loading-bar.css',
                        'public/libs/angular-ui-select/dist/select.css',
                        'public/libs/angular-ui-grid/ui-grid.css',
                        'public/libs/ng-tags-input/ng-tags-input.css',
                        'public/dist/css/style.css'
                    ]
                }
            }
        },

        copy: {
            fonts: {
                options: {
                    flatten: true
                },
                files: {
                    'public/dist/fonts/fontawesome-webfont.eot': 'public/libs/fontawesome/fonts/fontawesome-webfont.eot',
                    'public/dist/fonts/fontawesome-webfont.ttf': 'public/libs/fontawesome/fonts/fontawesome-webfont.ttf',
                    'public/dist/fonts/fontawesome-webfont.woff': 'public/libs/fontawesome/fonts/fontawesome-webfont.woff',
                    'public/dist/fonts/fontawesome-webfont.woff2': 'public/libs/fontawesome/fonts/fontawesome-webfont.woff2',
                    'public/dist/fonts/glyphicons-halflings-regular.eot': 'public/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
                    'public/dist/fonts/glyphicons-halflings-regular.ttf': 'public/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
                    'public/dist/fonts/glyphicons-halflings-regular.woff': 'public/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
                    'public/dist/fonts/glyphicons-halflings-regular.woff2': 'public/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
                    'public/dist/css/ui-grid.eot': 'public/libs/angular-ui-grid/ui-grid.eot',
                    'public/dist/css/ui-grid.svg': 'public/libs/angular-ui-grid/ui-grid.svg',
                    'public/dist/css/ui-grid.ttf': 'public/libs/angular-ui-grid/ui-grid.ttf',
                    'public/dist/css/ui-grid.woff': 'public/libs/angular-ui-grid/ui-grid.woff'

                }
            },
            templates: {
                options: {
                    flatten: true
                },
                files: {
                    'public/views/templates/dirPagination.tpl.html': 'public/libs/angular-utils-pagination/dirPagination.tpl.html'
                }
            }
        },

        // COOL TASKS ==============================================================
        // watch css and js files and process the above tasks
        watch: {
            css: {
                files: ['public/css/**/*.less', 'public/css/**/*.css'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['public/js/**/*.js', 'public/js/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },

        // watch our node server for changes
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }



    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'uglify', 'copy', 'concurrent']);
    grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'copy', 'concurrent']);
    grunt.registerTask('build', ['less', 'cssmin', 'jshint', 'uglify', 'copy']);

};