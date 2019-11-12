# detective-esm

find ES module dependencies

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/detective-esm.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/detective-esm
[travis-image]: https://img.shields.io/travis/com/browserify/detective-esm.svg?style=flat-square
[travis-url]: https://travis-ci.com/browserify/detective-esm
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Example

input.js:
```js
import xyz from 'xyz'
import 'a'

require('b')

export default function d () {}
export { d as c }
```

log.js:
```js
var detective = require('detective-esm')
var fs = require('fs')

console.log(detective(
  fs.readFileSync('./input.js')
))
```

```
$ node log.js
{ strings: [ 'xyz', 'a' ],
  expressions: [],
  imports: [ { from: 'xyz', import: 'default', as: 'xyz' } ],
  exports: [ { export: 'd', as: 'default' }, { export: 'd', as: 'c' } ] }
```

## Install

```
npm install detective-esm
```

## Usage

```js
var detectiveEsm = require('detective-esm')
```

## License

[MIT](LICENSE.md)
