/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    uglify: {
      dist: {
        files: {
          'dist/js/main.js': ['src/js/main.js'],
          'dist/js/modernizr.custom.86080.js': ['src/js/modernizr.custom.86080.js']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'src/css/style.min.css': ['src/css/style.css']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    },
    copy: {
      dist: {
        files: [
          {expand: true, flatten: true, src: ['src/i/**'], dest: 'dist/i', filter: 'isFile'}
        ]
      }
    },
    addchins : {
      dist: {
        options: {
          herp: true
        },
        src: 'dist/i/*.gif'
      }
    }
  });

  grunt.registerMultiTask('addchins', "Finds all chins and adds them to main.js", function () {
    var filesarr = [], filestr;

    this.files.forEach(function(file) {
      file.src.forEach(function(src) {
        var filename = src.replace(/^.*[\\\/]/, '')
        filesarr.push("'" + filename + "'");
      });
    });

    filestr = filesarr.join(", ");
    grunt.file.write('src/js/main.js',
      grunt.template.process(
        grunt.file.read('src/template/main.js.tmpl'),
        { data: { files : filestr } }
      )
    );
  });

  grunt.registerTask('inlinecss', "Inlines CSS", function () {
    var cssmin;
    cssmin = grunt.file.read('src/css/style.min.css');
    grunt.file.write('src/index.html',
      grunt.template.process(
        grunt.file.read('src/template/index.html.tmpl'),
        { data: { styles : cssmin } }
      )
    );
  });

  grunt.registerTask('tidyup', "Remove unneeded files", function () {
    grunt.file.delete('src/index.html');
    grunt.file.delete('src/js/main.js');
    grunt.file.delete('src/css/style.min.css');
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['copy', 'addchins', 'uglify', 'cssmin', 'inlinecss', 'htmlmin', 'tidyup']);

};