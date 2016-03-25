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
        bower: {
            install: {
                options: {
                    install: true,
                    targetDir: './js/lib',
                    cleanBowerDir: true,
                    cleanTargetDir: true,
                    verbose: true
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
                    src: ['jsx/*.jsx','js/lib/nreactjs/jsx/*.jsx'],
                    dest: 'js/tmp/',
                    ext: '.js'
                }]
            }
        },
        webfont: {
            icons: {
                src: ['icons/*.svg','js/lib/nreactjs/icons/*.svg'],
                dest: 'fonts',
                destCss: 'sass/icons',          //Ruta de destino donde se creará la hoja de estilos css y un html ejemplo
                options: {
                    stylesheet: 'scss',      //Extensión de la hoja de estilos, css
                    relativeFontPath: '../fonts',    //La ruta del src - font-family que se imprime dentro de la hoja de estilos
                    syntax: 'bem',
                    template: 'js/lib/nreactjs/icons/templates/icons.scss'/*,
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
                    loadPath: [ 'js/lib/nreactjs/sass/','sass/icons/' ],
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
                src: [  'js/tmp/js/lib/nreactjs/jsx/base.js',

                        'js/tmp/js/lib/nreactjs/jsx/boton.js',
                        'js/tmp/js/lib/nreactjs/jsx/menu_item.js',
                        'js/tmp/js/lib/nreactjs/jsx/menu.js',

                        'js/tmp/js/lib/nreactjs/jsx/dialogo.js',
                        
                        'js/tmp/js/lib/nreactjs/jsx/combo.js',
                        'js/tmp/js/lib/nreactjs/jsx/checkbox.js',
                        'js/tmp/js/lib/nreactjs/jsx/textfield.js',
                        
                        'js/tmp/js/lib/nreactjs/jsx/celda.js',
                        'js/tmp/js/lib/nreactjs/jsx/fila.js',
                        'js/tmp/js/lib/nreactjs/jsx/tabla.js',
                        
                        'js/tmp/js/lib/nreactjs/jsx/lista_tabla.js',
                        'js/tmp/js/lib/nreactjs/jsx/panel_tabla.js',

                        'js/tmp/jsx/app.js' ],
                dest: 'js/app.js'
            }
        },
        clean: ["js/tmp"]
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('jsx', ['bower','babel','concat','clean']);
    grunt.registerTask('fonts', ['webfont']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('release', ['jsx','fonts','sass']);

};
