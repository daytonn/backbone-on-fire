module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['chai-jquery', 'mocha-debug', 'sinon-chai', 'mocha', 'jquery-1.9.1'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/underscore/underscore.js',
      'node_modules/backbone/backbone.js',
      'node_modules/chai-fuzzy/index.js',
      'spec/support/chai-literals.js',
      'spec/support/mocha-fixture.js',
      'dist/backbone-on-fire.js',
      'spec/**/*_spec.js'
    ],
    exclude: [],
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'dist/**/*.js': ['coverage']
    },
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // browsers: ['Chrome', 'Firefox', 'Safari', 'ChromeCanary', 'PhantomJS'],
    browsers: ['Chrome'],
    singleRun: false
  });
};
