# phantom-promise

A [PhantomJS](http://phantomjs.org/) bridge with a promise based api.

[![npm version](https://img.shields.io/npm/v/phantom-promise.svg)](https://www.npmjs.com/package/phantom-promise)
[![npm license](https://img.shields.io/npm/l/phantom-promise.svg)](https://www.npmjs.com/package/phantom-promise)
[![Travis](https://img.shields.io/travis/panosoft/phantom-promise.svg)](https://travis-ci.org/panosoft/phantom-promise)
[![David](https://img.shields.io/david/panosoft/phantom-promise.svg)](https://david-dm.org/panosoft/phantom-promise)
[![npm downloads](https://img.shields.io/npm/dm/phantom-promise.svg)](https://www.npmjs.com/package/phantom-promise)

## Installation

```sh
npm install phantom-promise
```

## Usage

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

## API

__Phantom__

- [`create`](#create)
- [`createPage`](#createPage)
- [`initialize`](#initialize)
- [`shutdown`](#shutdown)

__Page__

- [`close`](#close)
- [`evaluate`](#evaluate)
- [`get`](#get)
- [`injectJs`](#injectJs)
- [`set`](#set)

---

### Phantom

<a name="create"/>
#### create ( )

Returns an instance of `Phantom`.

__Example__

```js
var Phantom = require('phantom');

var phantom = Phantom.create();
```

---

<a name="createPage"/>
#### createPage ( )

Creates a [Web Page](http://phantomjs.org/api/webpage/) in PhantomJs. Returns a `Promise` that is fulfilled with an instance of `Page`.

Pages have a default `viewportSize` of 1024x768 and support es5.

__Example__

```js
phantom.createPage()
  .then(function (page) {
    // ...
  })
```

---

<a name="initialize"/>
#### initialize ( )

Initializes the `Phantom` instance. Returns a `Promise` that is fulfilled once the initialization is complete.

This must be called before the instance can be used.

__Example__

```js
phantom.initialize()
  .then(function () {
    // ...
  });
```

---

<a name="shutdown"/>
#### shutdown ( )

Shuts down the phantom instance. Once this has been called, the instance is no longer operable unless it is re-initialized.

__Example__

```js
phantom.shutdown();
```

---

### Page

<a name="close"/>
#### close ( )

Closes the page. Once this has been called, the page instance can no longer be used.

__Example__

```js
page.close();
```

---

<a name="evaluate"/>
#### evaluate ( fn [,arg] )

Evaluates a function on the page. Returns a `Promise` that is fulfilled with the return value of the function.

__Arguments__

- `fn` - The function to evaluate on the page. This function must call `window.callPhantom(result)` in order to return.
- `arg` - An argument to evaluate `fn` with. This argument must be JSON-serializable (i.e. Closures, functions, DOM nodes, etc. will not work!).

__Example__

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

---

<a name="get"/>
#### get ( property )

Returns a Promise that is fulfilled with the requested page property.

__Arguments__

- `property` - A string determining the property to return.

__Example__

```js
page.get('viewportSize')
  .then(function (viewportSize) {
    // ...
  });
```

---

<a name="injectJs"/>
#### injectJs ( paths )

Injects external scripts into the page. The scripts are loaded in the order they are supplied so that dependencies can be met.

__Arguments__

- `paths` - A path or an array of paths to the script files to be injected.

__Example__

```js
page.injectJs('path/to/external/script.js');
```

---

<a name="set"/>
#### set ( property , value )

Sets a page property.

__Arguments__

- `property` - A string determining the property to set.
- `value` - The value to apply.

__Example__

```js
page.set('viewportSize', {height: 768, width: 1024});
```
