module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['jsx/**/*.jsx','sass/**/*.scss'],
                tasks: ['release'],
                options: {
                    interrupt: true
                }
            }
        },
        babel: {
            options: {
                plugins: ['transform-react-jsx'], // npm install babel-plugin-transform-react-jsx
                presets: ['es2015', 'react'] // npm install babel-preset-es2015 babel-preset-react
            },
            jsx: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['jsx/*.jsx','bower_components/nreactjs/jsx/*.jsx'],
                    dest: 'js/tmp/',
                    ext: '.js'
                }]
            }
        },
        webfont: {
            icons: {
                src: ['icons/*.svg','bower_components/nreactjs/icons/*.svg'],
                dest: 'fonts',
                destCss: 'sass/icons',          //Ruta de destino donde se creará la hoja de estilos css y un html ejemplo
                options: {
                    stylesheet: 'scss',      //Extensión de la hoja de estilos, css
                    relativeFontPath: '../fonts',    //La ruta del src - font-family que se imprime dentro de la hoja de estilos
                    syntax: 'bem',
                    template: 'bower_components/nreactjs/icons/templates/icons.scss'/*,
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
                    loadPath: [ 'bower_components/nreactjs/sass/','sass/icons/' ],
                    style: 'expanded'
                },
                files: {
                    'css/styles.css': 'sass/styles.scss'
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                src: [  'js/tmp/bower_components/nreactjs/jsx/boton.js',
                        'js/tmp/bower_components/nreactjs/jsx/menu_item.js',
                        'js/tmp/bower_components/nreactjs/jsx/menu.js',

                        'js/tmp/bower_components/nreactjs/jsx/dialogo.js',
                        
                        'js/tmp/bower_components/nreactjs/jsx/combo.js',
                        'js/tmp/bower_components/nreactjs/jsx/checkbox.js',
                        'js/tmp/bower_components/nreactjs/jsx/textfield.js',
                        
                        'js/tmp/bower_components/nreactjs/jsx/celda.js',
                        'js/tmp/bower_components/nreactjs/jsx/fila.js',
                        'js/tmp/bower_components/nreactjs/jsx/tabla.js',
                        
                        'js/tmp/bower_components/nreactjs/jsx/lista_tabla.js',
                        'js/tmp/bower_components/nreactjs/jsx/panel_tabla.js',
                        
                        'js/tmp/jsx/app.js',
                        
                        'js/tmp/bower_components/nreactjs/jsx/base.js'],
                dest: 'js/app.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-webfont');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('jsx', ['babel','concat']);
    grunt.registerTask('fonts', ['webfont']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('release', ['jsx','fonts','sass']);

};
