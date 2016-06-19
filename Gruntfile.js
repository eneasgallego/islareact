module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        folder: {
            js: '<%= pkg.folder %>js/',     // folder.js    -> web/js/
            fonts: '<%= pkg.folder %>fonts/',     // folder.fonts    -> web/fonts/
            css: '<%= pkg.folder %>css/'    // folder.css   -> web/css/
        },
        watch: {
            scripts: {
                files: ['jsx/**/*.jsx','sass/**/*.scss'],
                tasks: ['release'],
                options: {
                    interrupt: true
                }
            }
        },
        bower: {
            install: {
                options: {
                    install: true,
                    targetDir: './<%= folder.js %>lib/', // bower.install.options.targetDir -> web/js/lib/
                    cleanBowerDir: true,
                    cleanTargetDir: true,
                    verbose: true
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [["babelify", { "stage": 0 }]]
                },
                files: {
                    "<%= folder.js %>/app.js": "jsx/index.jsx"
                }
            }
        },
        babel: {
            options: {
                plugins: ['transform-react-jsx'], // npm install babel-plugin-transform-react-jsx
                presets: ['es2015', 'react', "stage-2"], // npm install babel-preset-es2015 babel-preset-react
                experimental: true
            },
            jsx: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['jsx/*.jsx','<%= bower.install.options.targetDir %>nreactjs/jsx/*.jsx'],
                    dest: '<%= folder.js %>tmp/', // babel.jsx.files[0].dest -> web/js/tmp/
                    ext: '.js'
                }]
            }
        },
        webfont: {
            icons: {
                src: ['icons/*.svg','<%= bower.install.options.targetDir %>nreactjs/icons/*.svg'],
                dest: '<%= folder.fonts %>',
                destCss: 'sass/icons',          //Ruta de destino donde se creará la hoja de estilos css y un html ejemplo
                options: {
                    stylesheet: 'scss',      //Extensión de la hoja de estilos, css
                    relativeFontPath: '../fonts',    //La ruta del src - font-family que se imprime dentro de la hoja de estilos
                    syntax: 'bem',
                    template: '<%= bower.install.options.targetDir %>nreactjs/icons/templates/icons.scss'/*,
                    templateOptions: {
                        baseClass: 'icon',
                        classPrefix: 'icon-',
                        mixinPrefix: 'icon-'
                    }*/
                }
            }
        },
        sass: {
            dist: {
                options: {
                    loadPath: [ '<%= bower.install.options.targetDir %>nreactjs/sass/','sass/icons/' ],
                    style: 'expanded'
                },
                files: {
                    '<%= folder.css %>styles.css': 'sass/styles.scss'
                }
            }
        },
        clean: ["<%= babel.jsx.files[0].dest %>"]
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-browserify");

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('jsx', ['bower','browserify','clean']);
    grunt.registerTask('release', ['jsx','webfont','sass']);
    grunt.registerTask('release2', ['sandbox','fonts','sass']);

};
