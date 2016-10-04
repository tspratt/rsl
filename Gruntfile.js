'use strict';

module.exports = function (grunt) {
	//require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Configurable paths for the application
	var appConfig = {
		app: 'public',
		dist: 'dist',
		tmp: '.tmp'
	};

	grunt.initConfig({
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/css/style.css': 'public/scss/style.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'./dist/{,*/}*'
					]
				}]
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%=app%>',
						dest: './dist',
						src: [
							'app.js',
							'*.html',
							'env-config.js',
							'lib/*.*',
							'style.css'
						]
					}
				]
			}
		},
		replace: {					//environment constants replacements
			local: {
				options: {
					patterns: [
						{json: grunt.file.readJSON('./config/local.json')}
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./config/env-config.js'],
					dest: 'public/providers/'
				}]
			},
			dev: {
				options: {
					patterns: [
						{json: grunt.file.readJSON('./config/dev.json')}
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./config/env-config.js'],
					dest: 'public/providers/'
				}]
			},
			/*//included to demonstrate pattern*/
			qa: {
				options: {
					patterns: [{
						json: grunt.file.readJSON('./config/qa.json')
					}]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./config/env-config.js'],
					dest: 'public/providers/'
				}]
			}
		}
	});

	grunt.registerTask('default', [
		'sass:dev',
		'replace:dev'
	]);


	grunt.registerTask('build_dev', [
		'sass:dev',
		'replace:dev'
	]);

	/* Use to run against local service */
	grunt.registerTask('build_local', [
		'sass:dev',
		'replace:local'
	]);

	//included to demonstrate pattern
	grunt.registerTask('build_qa', [
		'sass:qa',
		'replace:qa'
	]);

	grunt.registerTask('build_dist', [
		'sass:dev',
		'replace:dev',
		'clean:dist',
		'copy:dist'
	]);
};