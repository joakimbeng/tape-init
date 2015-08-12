'use strict';
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var lookUp = require('look-up');
var hasFlag = require('has-flag');

var DEFAULT_TEST_SCRIPT = 'echo "Error: no test specified" && exit 1';

module.exports = function (opts, cb) {
  if (typeof opts !== 'object') {
    cb = opts;
    opts = {};
  }

  cb = cb || function () {};

  var cwd = opts.cwd || process.cwd();
  var pattern = opts.pattern || '\'test/**/*.js\'';
  var promised = opts.promise || hasFlag('promise');

  var pkg;
  var pkgPath = lookUp('package.json', {cwd: cwd});

  if (pkgPath) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } else {
    pkgPath = path.resolve(cwd, 'package.json');
    pkg = {};
  }

  var s = pkg.scripts = pkg.scripts ? pkg.scripts : {};

  var lib = 'tape';

  if (promised) {
    lib = 'blue-' + lib;
  }

  var cmd = lib + ' ' + pattern;

  if (s.test && s.test !== DEFAULT_TEST_SCRIPT) {
    // don't add if it's already there
    if (!/tape/.test(s.test)) {
      s.test = s.test + ' && ' + cmd;
    }
  } else {
    s.test = cmd;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, '  ') + '\n');

  childProcess.execFile('npm', ['install', '--save-dev', lib], {cwd: cwd}, function (err) {
    if (err) {
      cb(err);
      return;
    }

    cb();
  });
};
