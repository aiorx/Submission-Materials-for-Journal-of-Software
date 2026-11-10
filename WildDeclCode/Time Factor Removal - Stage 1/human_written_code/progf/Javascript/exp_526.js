#! /usr/bin/env node

var fs = require('fs/promises');
var util = require('util');
var process = require('process');
var compile = require('./compiler.js');

var help = "Ael compiler

Syntax: src/ael.js <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:

  ast        the abstract syntax tree
  analyzed   the semantically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
  c          the translation to C
  llvm       the translation to LLVM
"

function description(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough. Defined properly in
  // the AST root class prototype so it automatically runs on console.log.
  var tags = new Map()

  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return
    tags.set(node, tags.size + 1)
    for (var child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child)
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return "#" + (tags.get(e)) + ""
      if (typeof e === "symbol") return e.description
      if (Array.isArray(e)) return "[" + (e.map(view)) + "]"
      return util.inspect(e)
    }
    for (var [node, id] of [...tags.entries()].sort(function (a, b) { return a[1] - b[1]; })) {
      var [type, props] = [node.constructor.name, ""]
      Object.entries(node).forEach(function ([k, v]) { return (props += " " + (k) + "=" + (view(v)) + ""); })
      yield "" + (String(id).padStart(4, " ")) + " | " + (type) + "" + (props) + ""
    }
  }

  tag(node)
  return [...lines()].join("\n")
}

async function compileFromFile(filename, outputType) {
  try {
    var buffer = await fs.readFile(filename)
    console.log(description(compile(buffer.toString(), outputType)))
  } catch (e) {
    console.error("" + (e) + "")
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}
