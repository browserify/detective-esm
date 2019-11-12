var acorn = require('acorn-node')
var xtend = require('xtend')

module.exports = function detectiveEsm (source, opts) {
  opts = opts || {}
  opts.parse = xtend({
    sourceType: 'module'
  }, opts.parse)

  var modules = {
    strings: [],
    expressions: [],
    imports: [],
    exports: []
  }
  if (opts.nodes) modules.nodes = []

  var ast = acorn.parse(source, opts.parse)
  for (var i = 0; i < ast.body.length; i++) {
    var node = ast.body[i]
    if (node.type === 'ImportDeclaration') {
      modules.strings.push(node.source.value)
      modules.imports = modules.imports.concat(getImports(node.specifiers, node.source.value, opts))
    }
    if (node.type === 'ExportDefaultDeclaration') {
      var name = null
      if (node.declaration && node.declaration.id) {
        name = node.declaration.id.name
      }
      modules.exports.push({ export: name, as: 'default' })
      if (opts.nodes) last(modules.exports).node = node
    }
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        modules.exports.push({ export: node.declaration.id.name, as: node.declaration.id.name })
        if (opts.nodes) last(modules.exports).node = node
      }
      if (node.specifiers.length > 0) {
        modules.exports = modules.exports.concat(getExports(node.specifiers, opts))
      }
    }
  }

  return modules
}

function getImports (specifiers, source, opts) {
  var imports = []
  for (var i = 0; i < specifiers.length; i++) {
    var node = specifiers[i]
    if (node.type === 'ImportDefaultSpecifier') {
      imports.push({
        from: source,
        import: 'default',
        as: node.local.name
      })
      if (opts.nodes) last(imports).node = node
    }
    if (node.type === 'ImportSpecifier') {
      imports.push({
        from: source,
        import: node.imported.name,
        as: node.local.name
      })
      if (opts.nodes) last(imports).node = node
    }
    if (node.type === 'ImportNamespaceSpecifier') {
      imports.push({
        from: source,
        import: '*',
        as: node.local.name
      })
      if (opts.nodes) last(imports).node = node
    }
  }
  return imports
}

function getExports (specifiers, opts) {
  var exports = []
  for (var i = 0; i < specifiers.length; i++) {
    var node = specifiers[i]
    if (node.type === 'ExportSpecifier') {
      exports.push({
        export: node.local.name,
        as: node.exported.name
      })
      if (opts.nodes) last(exports).node = node
    }
  }
  return exports
}

function last (arr) { return arr[arr.length - 1] }
