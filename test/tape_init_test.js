'use strict';
var fs = require('fs');
var path = require('path');
var test = require('tape');
var tempWrite = require('temp-write');
var dotProp = require('dot-prop');
var tapeInit = require('../');

var originalArgv = process.argv.slice();

function run(assert, pkg, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }

  var filepath = tempWrite.sync(JSON.stringify(pkg), 'package.json');

  tapeInit({
    cwd: path.dirname(filepath),
    pattern: opts.pattern,
    promise: opts.promise
  }, function (err) {
    assert.error(err, 'No error should occur');
    var pkg2 = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    cb(pkg2);
  });
}

test('empty package.json', function (assert) {
  assert.plan(3);

  run(assert, {}, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.tape'), 'tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'tape \'test/**/*.js\'', 'and to scripts.test');
  });
});

test('has scripts', function (assert) {
  assert.plan(3);

  run(assert, {
    scripts: {
      start: ''
    }
  }, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.tape'), 'tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'tape \'test/**/*.js\'', 'and to scripts.test');
  });
});

test('has default test', function (assert) {
  assert.plan(3);

  run(assert, {
    scripts: {
      test: 'echo "Error: no test specified" && exit 1'
    }
  }, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.tape'), 'tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'tape \'test/**/*.js\'', 'and to scripts.test');
  });
});

test('has test with some tape flavor', function (assert) {
  assert.plan(2);

  run(assert, {
    scripts: {
      test: 'blue-tape test.js'
    }
  }, function (pkg) {
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'blue-tape test.js', 'scripts.test should not be modified');
  });
});

test('has test', function (assert) {
  assert.plan(3);

  run(assert, {
    scripts: {
      test: 'mocha'
    }
  }, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.tape'), 'tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'mocha && tape \'test/**/*.js\'', 'and appended to scripts.test');
  });
});

test('has --promise cli arg', function (assert) {
  assert.plan(3);

  process.argv = originalArgv.concat(['--promise']);

  run(assert, {
    scripts: {
      start: ''
    }
  }, function (pkg) {
    process.argv = originalArgv;
    assert.ok(dotProp.get(pkg, 'devDependencies.blue-tape'), 'blue-tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'blue-tape \'test/**/*.js\'', 'and to scripts.test');
  });
});

test('has promise option', function (assert) {
  assert.plan(3);

  run(assert, {}, {promise: true}, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.blue-tape'), 'blue-tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'blue-tape \'test/**/*.js\'', 'and to scripts.test');
  });
});

test('has pattern option', function (assert) {
  assert.plan(3);

  run(assert, {}, {pattern: 'src/**/*_test.js'}, function (pkg) {
    assert.ok(dotProp.get(pkg, 'devDependencies.tape'), 'tape should have been added to package');
    assert.equal(dotProp.get(pkg, 'scripts.test'), 'tape src/**/*_test.js', 'and to scripts.test with specified pattern');
  });
});
