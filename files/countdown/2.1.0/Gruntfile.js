'use strict';

module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = {
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['dist/*', 'doc/*', 'report/*', 'temp/*'],
			tests: ['test/*.min.tests.html']
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: ['*.html', 'css/*.*', 'img/*.*', 'js/*.*'],
						dest: 'dist'
					},
					{
						expand: true,
						cwd: 'src/bower_components/kbw-plugin/dist/js',
						src: ['*.*'],
						dest: 'dist/js'
					}
				]
			}
		},
		jsdoc: {
			options: {
				destination: 'doc'
			},
			all: ['src/js/*.js', '!src/js/*-*.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: ['src/js/*.js']
		},
		qunit: {
			options: {
				coverage: {
					disposeCollector: true,
					src: ['src/js/*.js', '!src/js/*-*.js'],
					instrumentedFiles: 'temp/',
					htmlReport: 'report/',
					linesThresholdPct: 95,
					statementsThresholdPct: 95,
					functionsThresholdPct: 95,
					branchesThresholdPct: 80
				}
			},
			all: ['test/*.html']
		},
		replace: {
			dist: {
				src: ['dist/index.html'],
				dest: 'dist/index.html',
				replacements: [
					{
						from: /bower_components\/jquery\/dist\/jquery.min.js/,
						to: 'http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
					},
					{
						from: /bower_components\/kbw-plugin\/dist\/js\/jquery.plugin.min.js/,
						to: 'js/jquery.plugin.min.js'
					}
				]
			},
			testmin: {
				src: ['test/countdown.tests.html'],
				dest: 'test/countdown.min.tests.html',
				replacements: [
				    {
						from: /src\/js\/jquery\.(.*)\.js/g,
						to: 'dist/js/jquery.$1.min.js'
					}
				]
			}
		},
		uglify: {
			options: {
				preserveComments: 'some',
				sourceMap: true
			},
			plugin: {
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['*.js', '!*-*.js'],
						dest: 'dist/js',
						ext: '.min.js',
						extDot: 'last'
					}
				]
			}
		},
		zip: {
			all: {
				cwd: 'dist',
				src: ['dist/*.html', 'dist/css/*.*', 'dist/img/*.*', 'dist/js/*.*'],
				dest: 'dist/jquery.countdown.package-<%= pkg.version %>.zip'
			}
		}
	};
	
	grunt.initConfig(config);

	grunt.registerTask('dist', [
		'copy:dist',
		'replace:dist',
		'zip'
	]);

	grunt.registerTask('test', [
		'replace:testmin',
		'qunit',
		'clean:tests'
	]);

	grunt.registerTask('default', [
		'clean:build',
		'jshint',
		'uglify',
		'test',
		'jsdoc',
		'dist'
	]);
};
