# tape-init

[![NPM version][npm-image]][npm-url] [![js-xo-style][codestyle-image]][codestyle-url]

> Add tape to your project

## Installation

Install `tape-init` using [npm](https://www.npmjs.com/):

```bash
npm install --save tape-init
```

## Usage

### Module usage

```javascript
var tapeInit = require('tape-init');

tapeInit(function (err) {
  // tape is now added to your project...
});
```

### CLI usage

```bash
$> tape_init --help

Usage: bin/tape_init [options]

Options:
  --promise   Add blue-tape instead of tape  [boolean]
  --pattern   Glob pattern for test files  [string] [default: "'test/**/*.js'"]
  -h, --help  Show help  [boolean]

Examples:
  bin/tape_init --promise --pattern src/**/*_test.js  Add blue-tape to your project, running all src/**/*_test.js files on npm test

```

## API

### `tapeInit([options], [cb])`

| Name | Type | Description |
|------|------|-------------|
| options | `Object` | Options |
| cb | `Function` | Callback |

#### options.cwd

Type: `string`  
Default: `process.cwd()`

Current working directory.

#### options.promise

Type: `boolean`  
Default: `false`

Will add [`blue-tape`](https://www.npmjs.com/package/blue-tape) to your project if set.

#### options.pattern

Type: `string`  
Default: `'test/**/*.js'`

Glob pattern to locate test files, when running tests with `npm test`.

## License

MIT

[npm-url]: https://npmjs.org/package/tape-init
[npm-image]: https://badge.fury.io/js/tape-init.svg
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-brightgreen.svg?style=flat
