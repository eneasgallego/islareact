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
                    cwd: 'jsx/',
                    src: ['*.jsx'],
                    dest: 'js/tmp/',
                    ext: '.js'
                }]
            }
        },
        webfont: {
            icons: {
                src: 'icons/*.svg',
                dest: 'fonts',
                destCss: 'sass/icons',          //Ruta de destino donde se creará la hoja de estilos css y un html ejemplo
                options: {
                    stylesheet: 'scss',      //Extensión de la hoja de estilos, css
                    relativeFontPath: '../fonts',    //La ruta del src - font-family que se imprime dentro de la hoja de estilos
                    syntax: 'bem',
                    template: 'icons/templates/icons.scss'/*,
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
                    style: 'expanded'
                },
                files: {
                    'css/app.css': 'sass/app.scss'
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
                src: [  'js/tmp/boton.js',
                        'js/tmp/menu_item.js',
                        'js/tmp/menu.js',

                        'js/tmp/dialogo.js',
                        
                        'js/tmp/combo.js',
                        'js/tmp/checkbox.js',
                        'js/tmp/textfield.js',
                        
                        'js/tmp/celda.js',
                        'js/tmp/fila.js',
                        'js/tmp/tabla.js',
                        
                        'js/tmp/lista_tabla.js',
                        'js/tmp/panel_tabla.js',
                        
                        'js/tmp/base.js'],
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
