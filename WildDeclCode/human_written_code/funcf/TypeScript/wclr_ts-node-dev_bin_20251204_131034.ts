```ts
unknown.forEach(function (arg) {
  if (arg === script || nodeArgs.indexOf(arg) >= 0) return

  const argName = arg.replace(/^-+/, '')
  // fix this
  const argOpts = (opts as any)[argName]
  const argValues = Array.isArray(argOpts) ? argOpts : [argOpts]
  argValues.forEach(function (argValue) {
    if ((arg === '-r' || arg === '--require') && argValue === 'esm') {
      opts.priorNodeArgs.push(arg, argValue)
      return false
    }
    nodeArgs.push(arg)
    if (typeof argValue === 'string') {
      nodeArgs.push(argValue)
    }
  })
})
```