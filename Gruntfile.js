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
        babel: {
            options: {
                plugins: ['transform-react-jsx'], // npm install babel-plugin-transform-react-jsx
                presets: ['es2015', 'react', "stage-2"] // npm install babel-preset-es2015 babel-preset-react
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
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: { // web/js/tmp/ web/js/lib/
                src: [  '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/base.js',

                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/boton.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/menu_item.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/menu.js',

                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/dialogo.js',
                        
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/combo.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/checkbox.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/textfield.js',
                        
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/celda.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/fila.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/tabla.js',
                        
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/lista_tabla.js',
                        '<%= babel.jsx.files[0].dest %><%= bower.install.options.targetDir %>nreactjs/jsx/panel_tabla.js',

                        '<%= babel.jsx.files[0].dest %>jsx/app.js' ],
                dest: '<%= folder.js %>app.js'
                //dest: '<%= babel.jsx.files[0].dest %>app.js'
            }
        },
        clean: ["<%= babel.jsx.files[0].dest %>"]
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
    grunt.registerTask('jsx2', ['babel','concat','clean']);
    grunt.registerTask('fonts', ['webfont']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('release', ['jsx','fonts','sass']);
    grunt.registerTask('release2', ['jsx2','fonts','sass']);

};
