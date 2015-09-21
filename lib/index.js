var co = require('co');
var is = require('is_js');
var PhantomJs = require('phantomjs');
var Phantom = require('phantom');

// Create a running phantom process
var create = function () {
	var options = {
		binary: PhantomJs.path,
		parameters: {}
	};

	// Error handlers
	// TODO fix // resume doesn't work here // want to be able to throw and have it caught
	//	options.onStderr = console.log; // (data) // contains ???
	//	options.onStdout = console.log; // (data) // contains browser js errors when evaluating code on a page
	//	options.onExit(code, signal)

	var initialized;
	var phantom;
	var initialize = co.wrap(function * () {
		if (initialized) throw new Error('Already initialized');
		// TODO handle creating mult phantoms by passing unique port number to each instance // options.port
		phantom = yield new Promise(resolve => Phantom.create(options, resolve));
		initialized = true;
	});
	var shutdown = function () {
		if (!initialized) throw new Error('Not initialized');
		phantom.exit();
		initialized = false;
	};
	// TODO support setting page options here
	var createPage = co.wrap(function * () {
		if (!initialized) throw new Error('Not initialized');
		var options = {
			viewportSize: {width: 1024, height: 768}
		};
		// TODO error handling?
		var page = yield new Promise(resolve => phantom.createPage(resolve));

		/**
		 * Injects js files from the given paths. They are loaded on the page
		 * one at a time in the order they are supplied so that dependencies
		 * can be met.
		 *
		 * @param {String|String[]} paths
		 *    File paths to the js files to inject.
		 */
		var injectJs = co.wrap(function * (paths) {
			paths = (is.array(paths)) ? paths : [paths];
			for (var i = 0; i < paths.length; i++) {
				var path = paths[i];
				var success = yield new Promise(resolve => page.injectJs(path, resolve));
				if (!success) throw new Error('Failed to inject: ' + path);
			}
		});
		/**
		 * Evaluate a function on a page.
		 *
		 * @param {Function} fn
		 *    Function to evaluate on page.
		 *    Must call `window.callPhantom(result)` to return.
		 * @param {*} arg
		 *    Argument to pass to fn when evaluated on page.
		 *    Only JSON-serializable arguments can be passed (i.e. Closures,
		 *    functions, DOM nodes, etc. will not work!)
		 *
		 * @returns {*} result
		 */
		var evaluate = function (fn, arg) {
			return new Promise((resolve, reject) => {
				// TODO onError -> (message, trace) process trace and add error output
				page.set('onError', reject);
				page.set('onCallback', result => {
					page.set('onCallback', null);
					resolve(result);
				});
				page.evaluate(fn, null, arg);
			});
		};
		var get = (property) =>
			new Promise(resolve => page.get(property, resolve));
		/**
		 * Set takes a variable number of parameters.
		 *
		 * @returns {Promise}
		 */
		var set = () => {
			var args = [].slice.call(arguments);
			return new Promise(resolve => {
				args.push(resolve);
				page.set.apply(page, args)
			});
		};

		// Initialize page
		yield set('viewportSize', options.viewportSize);
		yield injectJs(require.resolve('es5-shim'));
		return {
			close: page.close,
			evaluate: evaluate,
			get: get,
			injectJs: injectJs,
			set: set
		};
	});
	return {
		initialize: initialize,
		shutdown: shutdown,
		createPage: createPage
	};
};
module.exports = {
	create: create
};
