module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	var taskConfig = {

		pkg: grunt.file.readJSON("package.json"),

		clean: {
			all: [
				'dist/*'
			],
			templates: [
				'dist/templates.js'
			]
		},

		html2js: {
			npAutocomplete: {
				options: {
					base: 'src'
				},
				src: ['src/**/*.tpl.html'],
				dest: 'dist/templates.js'
			}
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

		concat: {
			npAutocomplete: {
				src: [
					'module.prefix',
					'src/np-autocomplete.js',
					'<%= html2js.npAutocomplete.dest %>',
					'module.suffix'
				],
				dest: 'dist/np-autocomplete.min.js'
			}
		},

		ngAnnotate: {
			npAutocomplete: {
				files: [{
					src: ['dist/np-autocomplete.min.js'],
					dest: 'dist/np-autocomplete.min.js'
				}]
			}
		},

		uglify: {
			npAutocomplete: {
				files: [{
					'<%= concat.npAutocomplete.dest %>': '<%= concat.npAutocomplete.dest %>'
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
				tasks: ['html2js', 'concat', 'ngAnnotate', 'less', 'clean:templates']
			}
		}
	};

	grunt.initConfig(grunt.util._.extend(taskConfig));

	grunt.registerTask('compile', ['clean:all', 'html2js', 'concat', 'less', 'clean:templates', 'ngAnnotate', 'uglify']);
	grunt.registerTask('default', ['compile']);
};