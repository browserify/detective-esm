var test = require('tape')
var detective = require('../')
var fs = require('fs')
var path = require('path')

test('detects imports but not requires', function (t) {
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/require.js')))

  t.equal(result.strings.length, 1, 'should have found a single dependency')
  t.equal(result.expressions.length, 0, 'should have empty `expressions` array for parity with detective')
  t.ok(result.strings.includes('a'), 'should find `import`')
  t.notOk(result.strings.includes('b'), 'should ignore `require`')
  t.end()
})

test('detects imported bindings', function (t) {
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/imports.js')))

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
  var result = detective(fs.readFileSync(path.join(__dirname, '/files/exports.js')))

  t.deepEqual(result.exports, [
    { export: 'a', as: 'default' },
    { export: 'b', as: 'b' },
    { export: 'c', as: 'c' },
    { export: 'd', as: 'e' }
  ])
  t.end()
})
