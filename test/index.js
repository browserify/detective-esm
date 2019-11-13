var test = require('tape')
var detective = require('../')
var fs = require('fs')
var path = require('path')

test('detects imports but not requires', function (t) {
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/require.mjs')))

  t.equal(result.strings.length, 1, 'should have found a single dependency')
  t.equal(result.expressions.length, 0, 'should have empty `expressions` array for parity with detective')
  t.notEqual(result.strings.indexOf('a'), -1, 'should find `import`')
  t.equal(result.strings.indexOf('b'), -1, 'should ignore `require`')
  t.end()
})

test('detects imported bindings', function (t) {
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/imports.mjs')))

  t.deepEqual(result.strings, ['a', 'b', 'c', 'xyz', 'ns'])
  t.deepEqual(result.imports, [
    { from: 'a', import: 'default', as: 'a' },
    { from: 'b', import: 'b', as: 'b' },
    { from: 'c', import: 'c', as: 'd' },
    { from: 'ns', import: '*', as: 'ns' }
  ])
  t.end()
})

test('detects exported bindings', function (t) {
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/exports.mjs')))

  t.deepEqual(result.exports, [
    { export: 'a', as: 'default' },
    { export: 'b', as: 'b' },
    { export: 'c', as: 'c' },
    { export: 'd', as: 'e' }
  ])
  t.end()
})
