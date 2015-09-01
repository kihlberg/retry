module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      retryPromise: {
        files: {
          'dist/retry-promise-<%= pkg.version %>.min.js': [
            'lib/promise-3.0.2.js',
            'src/retry.js'
          ]
        }
      },
      retry: {
        files: {
          'dist/retry-<%= pkg.version %>.min.js': [
            'src/retry.js'
          ]
        }
      }
    },

    jasmine: {
      retry: {
        src: ['lib/**/*.js', 'src/**/*.js'],
        options: {
          specs: 'tests.js'
        }
      }
    }
  });

  grunt.registerTask('test', ['jasmine'])
  grunt.registerTask('prod', ['test', 'uglify']);
  grunt.registerTask('default', ['prod']);

};
