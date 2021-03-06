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
      build: {
        options: {},
        files: {
          'build/script.js': ['src/js/ga.js', 'src/js/app.js']
        }
      },
      dev: {
        options: {
          beautify: true,
          mangle: false,
          compress: false
        },
        files: {
          'build/script.js': ['src/js/app.js']
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'src/css/style.min.css': ['src/css/style.css']
        }
      }
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'src/index.html'
        }
      }
    },
    copy: {
      build: {
        files: [
          {expand: true, flatten: true, src: ['src/i/**'], dest: 'build/i', filter: 'isFile'},
          {src: 'src/images.json', dest: 'build/images.json'}
        ]
      }
    },
    addchins : {
      build: {
        src: 'src/i/*.gif'
      }
    }
  });

  grunt.registerMultiTask('addchins', "Finds all chins and adds them to images.json", function () {
    var filesobj = [], filestr;
    fs = require('fs');

    this.files.forEach(function(file) {
      file.src.forEach(function(src) {
        var date = new Date(fs.statSync(src).mtime).toUTCString();
        var filename = src.replace(/^.*[\\\/]/, '/i/');
        var name = src.match(/([^\/]+)(?=\.\w+$)/)[0];
        var obj = {};
        obj["url"] = filename;
        obj["date"] = date;
        obj["name"] = name;
        filesobj.push(obj);
      });
    });

    filestr = JSON.stringify(filesobj);
    grunt.file.write( 'src/images.json', filestr );
  });

  grunt.registerTask('inliner', "Inlines CSS", function () {
    var cssmin, modernizrmin, mainmin;
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
    grunt.file.delete('src/images.json');
    grunt.file.delete('src/css/style.min.css');
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('build', ['addchins', 'copy', 'uglify:build', 'cssmin', 'inliner', 'htmlmin', 'tidyup']);
  grunt.registerTask('dev', ['addchins', 'uglify:dev', 'cssmin', 'inliner']);

};