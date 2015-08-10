# phantom-promise

A [PhantomJS](http://phantomjs.org/) bridge with a promise based api.

[![npm](https://img.shields.io/npm/v/phantom-promise.svg)]()
[![npm](https://img.shields.io/npm/l/phantom-promise.svg)]()
[![Travis](https://img.shields.io/travis/panosoft/phantom-promise.svg)]()
[![David](https://img.shields.io/david/panosoft/phantom-promise.svg)]()
[![npm](https://img.shields.io/npm/dm/phantom-promise.svg)]()

# Installation

```
npm install phantom-promise
```

# Usage

```js
var Phantom = require('phantom');

var phantom = Phantom.create();
phantom.initialize()
  .then(function () {
    return phantom.createPage();
  })
  .then(function (page) {
    var pageFunction = function () {
      var result = 'Hello from Phantom.';
      window.callPhantom(result);
    };
    return page.evaluate(pageFunction);
  })
  .then(function (result) {
    console.log(result); // Hello from Phantom.
  });
```

# API

## create()

Returns an instance of `Phantom`.

### Example

```js
var Phantom = require('phantom');

var phantom = Phantom.create();
```

## Phantom

### createPage()

Creates a [Web Page](http://phantomjs.org/api/webpage/) in PhantomJs. Returns a `Promise` that is fulfilled with an instance of `Page`.

#### Example

```js
phantom.createPage()
  .then(function (page) {
    // ...
  })
```

### initialize()

Initializes the `Phantom` instance. Returns a `Promise` that is fulfilled once the initialization is complete.

This must be called before the instance can be used.

#### Example

```js
phantom.initialize()
  .then(function () {
    // ...
  });
```

### shutdown()

Shuts down the phantom instance. Once this has been called, the instance is no longer operable unless it is re-initialized.

#### Example

```js
phantom.shutdown();
```

## Page

### close()

Closes the page. Once this has been called, the page instance can no longer be used.

#### Example

```js
page.close();
```

### evaluate( fn [,arg] )

Evaluates a function on the page. Returns a `Promise` that is fulfilled with the return value of the function.

#### Arguments

- `fn` - The function to evaluate on the page. This function must call `window.callPhantom(result)` in order to return.
- `arg` - An argument to evaluate `fn` with. This argument must be JSON-serializable (i.e. Closures, functions, DOM nodes, etc. will not work!).

#### Example

```js
var pageFunction = function (arg) {
  window.callPhantom(arg);
};
var arg = 'Hello from Phantom.';

page.evaluate(pageFunction, arg)
  .then(function (result) {
    console.log(result); // 'Hello from Phantom.'
  });
```

### injectJs( paths )

Injects external scripts into the page. The scripts are loaded in the order they are supplied so that dependencies can be met.

#### Arguments

- `paths` - A path or an array of paths to the script files to be injected.

#### Example

```js
page.injectJs('path/to/external/script.js');
```
