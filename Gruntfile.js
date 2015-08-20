'use strict';

module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      all: [
      'dist/*'
      ]
    },

    less: {
      options: {
        compress: true
      },

      npAutocomplete: {
        files: {
          'dist/np-autocomplete.min.css': ['src/np-autocomplete.less']
        }
      }
    },

    ngAnnotate: {
      npAutocomplete: {
        files: [{
          src: ['src/np-autocomplete.js'],
          dest: 'dist/np-autocomplete.min.js'
        }]
      }
    },

    uglify: {
      npAutocomplete: {
        files: [{
          'dist/np-autocomplete.min.js': 'dist/np-autocomplete.min.js'
        }]
      }
    },

    watch: {
      scripts: {
        options: {
          livereload: true,
          spawn: false
        },
        files: [
        'src/*',
        'demos/*'
        ],
        tasks: ['compile']
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig));
  grunt.registerTask('compile', ['clean', 'less', 'ngAnnotate', 'uglify']);
  grunt.registerTask('default', ['compile']);
};
