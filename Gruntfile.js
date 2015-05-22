// Generated on 2014-09-24 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-angular-templates');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var modRewrite = require('connect-modrewrite'),
        request = require('request');

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    function isRequestServedByNode(url) {
      return url.slice(-1) === '/'
    }

    // Define the configuration for all the tasks
    grunt.initConfig({


        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            poChanged: {
                files: ['po/translations/{,*/}*.po'],
                tasks: ['nggettext_compile']
            },
            htmlChanged: {
                files: ['app/views/{,*/}*.html'],
                tasks: ['ngtemplates']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            function(req, res, next) {
                              if (!isRequestServedByNode(req.url)) {
                                return next();
                              }

                              var indexHtmlReq = request.get('http://localhost:5000' + req.url);
                              req.pipe(indexHtmlReq);
                              indexHtmlReq.pipe(res)
                              .on('error', function() {
                                console.log("error while retrieving index.html");
                              });
                            },
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/{,*/}*.js', '!<%= yeoman.app %>/scripts/custom/translations.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            options: {
                cwd: '<%= yeoman.app %>'
            },
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: './bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: true,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: false
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '!<%= yeoman.dist %>/images/static/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/scripts/*.js'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/views', '<%= yeoman.dist %>/images'],
                patterns: {
                    js: [
                        [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images'],
                        [/(views\/.*?\.html)/gm, 'Update the JS to reference our revved templates']
                    ]
                }
            }
        },

        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeCommentsFromCDATA: true,
                    removeCDATASectionsFromCDATA: true,
                    ignoreCustomComments: [
                        /^\s+smm/,
                        /\/smm\s+$/
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'views/{,*/}*.html',
                        'images/{,*/}*.{webp}',
                        'styles/fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: 'json/*',
                    dest: '<%= yeoman.dist %>'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            config_dev: {
              src: 'nodeapp/config/config_dev.json',
              dest: 'nodeapp/config/config.json'
            },
            config_prod: {
              src: 'nodeapp/config/config_prod.json',
              dest: 'nodeapp/config/config.json'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // removelogging: {
        //     dist: {
        //         src: '<%= yeoman.dist %>/scripts/*.js'
        //     }
        // },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
		nightwatch:{
			options: {
				src_folders : ['test/nightwatch'],
				globals_path : 'test/paramsCI.js',
				test_settings : {
					'default' : {
					  'launch_url' : 'http://localhost',
					  'selenium_port'  : 4444,
					  'selenium_host'  : 'localhost',
					  'silent': true,
					  'screenshots' : {
						'enabled' : false,
						'path' : ''
					  },
					  'desiredCapabilities': {
						'browserName': 'firefox',
						'javascriptEnabled': true,
						'acceptSslCerts': true
					  }
					}
				},
				selenium : {
					'start_process' : false,
					'host' : '127.0.0.1',
					'port' : 4444

				}

			}
		},

        // protractor: {
            // options: {
                // configFile: 'test/protractor-conf.js',
                // keepAlive: false, // If false, the grunt process stops when the test fails.
                // noColor: false, // If true, protractor will not use colors in its output.
                // args: {}
            // },
            // all: {}
        // },

        nggettext_extract: {
            pot: {
                files: {
                    'po/templates/_classesView.pot': ['app/views/_classesView.html'],
                    'po/templates/loginForm.pot': ['app/views/_loginForm.html'],
                    'po/templates/about.pot': ['app/views/about.html'],
                    'po/templates/agb.pot': ['app/views/agb.html'],
                    'po/templates/class.pot': ['app/views/class.html'],
                    'po/templates/classes.pot': ['app/views/classes.html'],
                    'po/templates/entity.pot': ['app/views/entity.html'],
                    'po/templates/entityList.pot': ['app/views/entityList.html'],
                    'po/templates/faq.pot': ['app/views/faq.html'],
                    'po/templates/homepage.pot': ['app/views/homepage.html'],
                    'po/templates/impressum.pot': ['app/views/impressum.html'],
                    'po/templates/login.pot': ['app/views/login.html'],
                    'po/templates/modalActivate.pot': ['app/views/modalActivate.html'],
                    'po/templates/modalBook.pot': ['app/views/modalBook.html'],
                    'po/templates/modalCancel.pot': ['app/views/modalCancel.html'],
                    'po/templates/modalMessage.pot': ['app/views/modalMessage.html'],
                    'po/templates/modalSubscribe.pot': ['app/views/modalSubscribe.html'],
                    'po/templates/modalSuccess.pot': ['app/views/modalSuccess.html'],
                    'po/templates/modalSuggest.pot': ['app/views/modalSuggest.html'],
                    'po/templates/modalSuspend.pot': ['app/views/modalSuspend.html'],
                    'po/templates/modalUpload.pot': ['app/views/modalUpload.html'],
                    'po/templates/resetPassword.pot': ['app/views/resetPassword.html'],
                    'po/templates/signup.pot': ['app/views/signup.html'],
                    'po/templates/studio.pot': ['app/views/studio.html'],
                    'po/templates/userAccount.pot': ['app/views/userAccount.html'],
                    'po/templates/userDashboard.pot': ['app/views/userDashboard.html'],
                    'po/templates/userStudios.pot': ['app/views/userStudios.html'],
                    'po/templates/userMembership.pot': ['app/views/userMembership.html'],
                    'po/templates/userProfile.pot': ['app/views/userProfile.html'],
                    'po/templates/index.pot': ['app/index.html']
                }
            }
        },
        nggettext_compile: {
            all: {
                options: {
                    module: 'boltApp'
                },
                files: {
                    'app/scripts/custom/translations.js': ['po/translations/de/*.po', 'po/translations/en/*.po', 'po/translations/fr/*.po']
                }
            }
        },
        ngtemplates:  {
            app:        {
                src:      'app/views/{,*/}*.html',
                dest:     'app/scripts/custom/templates.js',
                options: {
                    module: 'boltApp',
                    htmlmin: {
                        removeComments: true,
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        removeCommentsFromCDATA: true,
                        removeCDATASectionsFromCDATA: true,
                        ignoreCustomComments: [
                            /^\s+smm/,
                            /\/smm\s+$/
                        ]
                    }
                }
            }
        },

        nodemon: {
          dev: {
            script: 'web.js',
            options: {
              cwd: __dirname,
              ignore: ['node_modules/**'],
              watch: ['nodeapp', 'web.js'],
            }
          }
        }
    });

	grunt.loadNpmTasks('grunt-nightwatch');

    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        // Running nodejs in a different process and displaying output on the main console
       var nodemon = grunt.util.spawn({
           cmd: 'grunt',
           grunt: true,
           args: 'nodemon'
       });

       nodemon.stdout.pipe(process.stdout);
       nodemon.stderr.pipe(process.stderr);

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma',
        'nightwatch'
    ]);

    grunt.registerTask('build', 'Build the app for different environments', function(target) {
      target = target || 'prod';

      grunt.task.run([
        'clean:dist',
        'copy:config_' + target,
        'ngtemplates',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
      ]);
    });

    grunt.registerTask('heroku', [
        'build'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('nodeapp', [
        'build',
        'nodemon'
    ]);
};
