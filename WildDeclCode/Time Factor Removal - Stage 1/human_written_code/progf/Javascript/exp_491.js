/* @flow */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/

// KeyboardEvent.keyCode aliases
var keyCodes: { [key: string]: number | Array<number> } = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}

// KeyboardEvent.key aliases
var keyNames: { [key: string]: string | Array<string> } = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  'delete': ['Backspace', 'Delete']
}

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function condition { return "if(" + (condition) + ")return null; };"

var modifierCode: { [key: string]: string } = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
}

function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean,
  warn: Function
): string {
  var res = isNative ? 'nativeOn:{' : 'on:{'
  for (var name in events) {
    res += '"' + (name) + '":' + (genHandler(name, events[name])) + ","
  }
  return res.slice(0, -1) + '}'
}

// Generate handler code with binding params on Weex
/* istanbul ignore next */
function genWeexHandler (params: Array<any>, handlerCode: string) {
  var innerHandlerCode = handlerCode
  var exps = params.filter(function exp { return simplePathRE.test(exp) && exp !== '$event'; })
  var bindings = exps.map(function exp { return ({ '@binding': exp }); })
  var args = exps.map(function (exp, i) {
    var key = "$_" + (i + 1) + ""
    innerHandlerCode = innerHandlerCode.replace(exp, key)
    return key
  })
  args.push('$event')
  return '{\n' +
    "handler:function(" + (args.join(',')) + "){" + (innerHandlerCode) + "},\n" +
    "params:" + (JSON.stringify(bindings)) + "\n" +
    '}'
}

function genHandler (
  name: string,
  handler: ASTElementHandler | Array<ASTElementHandler>
): string {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return "[" + (handler.map(function handler { return genHandler(name, handler); }).join(',')) + "]"
  }

  var isMethodPath = simplePathRE.test(handler.value)
  var isFunctionExpression = fnExpRE.test(handler.value)

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, handler.value)
    }
    return "function($event){" + (handler.value) + "}" // inline statement
  } else {
    var code = ''
    var genModifierCode = ''
    var keys = []
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else if (key === 'exact') {
        var modifiers: ASTModifiers = (handler.modifiers: any)
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function keyModifier { return !modifiers[keyModifier]; })
            .map(function keyModifier { return "$event." + (keyModifier) + "Key"; })
            .join('||')
        )
      } else {
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    var handlerCode = isMethodPath
      ? "return " + (handler.value) + "($event)"
      : isFunctionExpression
        ? "return (" + (handler.value) + ")($event)"
        : handler.value
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, code + handlerCode)
    }
    return "function($event){" + (code) + "" + (handlerCode) + "}"
  }
}

function genKeyFilter (keys: Array<string>): string {
  return "if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;"
}

function genFilterCode (key: string): string {
  var keyVal = parseInt(key, 10)
  if (keyVal) {
    return "$event.keyCode!==" + (keyVal) + ""
  }
  var keyCode = keyCodes[key]
  var keyName = keyNames[key]
  return (
    "_k($event.keyCode," +
    "" + (JSON.stringify(key)) + "," +
    "" + (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) + "" +
    ")"
  )
}
