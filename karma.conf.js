module.exports = function(config) {
	config.set({
		frameworks: ['jasmine'],
		reporters: ['spec'],
		browsers: ['PhantomJS'],
		files: [
			'node_modules/angular/angular.min.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/angular-ui-router/release/angular-ui-router.min.js',
			'src/**/*.js',
			'_tests/**/*.js'
		]
	});
};