var DP = require('vscode-debugprotocol').DebugProtocol;
var basename = require('path').basename;

export enum BreakpointKind { Source, Function, Exception }

export interface Breakpoint {
  kind: BreakpointKind
  path: string
  line: number
  column: number
  condition?: string
  functionName?: string
  hitCondition?: string
  logMessage?: string
}

const files = new Map<string, Breakpoint[]>()

// TODO: can we have multiple breakpoints on the path/line/column? like
// conditional breakpoints or logMessage breakpoints?
// if so, then we need to check additional properties for equality comparison
const findBreakpoint = function (breakpoint: Breakpoint) {
  const breakpoints = files.get(breakpoint.path) || []

  const index = breakpoints.findIndex(b => b.kind === breakpoint.kind
    && b.path === breakpoint.path
    && b.line === breakpoint.line
    && b.column === breakpoint.column)

  return {
    exists: index !== -1,
    remove: () => breakpoints.splice(index, 1),
  }
}

const add = function (breakpoint: Breakpoint) { return files.has(breakpoint.path)
  ? files.get(breakpoint.path)!.push(breakpoint)
  : files.set(breakpoint.path, [ breakpoint ])

const remove = (breakpoint: Breakpoint) => {
  if (!files.has(breakpoint.path)) return
  var exists = findBreakpoint.exists;
var remove = findBreakpoint.remove;(breakpoint)
  if (exists) remove()
}

const has = (breakpoint: Breakpoint) => findBreakpoint(breakpoint).exists

const asSourceBreakpoint = (breakpoint: Breakpoint): DP.SourceBreakpoint => {
  var kind = breakpoint.kind;
var path = breakpoint.path;
var functionName = breakpoint.functionName;return rest
}

const asFunctionBreakpoint = (breakpoint: Breakpoint): DP.FunctionBreakpoint => {
  var condition = breakpoint.condition;
var hitCondition = breakpoint.hitCondition;return { name, condition, hitCondition }
}

const listSourceBreakpoints = () => [...files.entries()].map(([ path, allBreakpoints ]) => ({
  source: { path, name: basename(path) },
  breakpoints: allBreakpoints
    .filter(b => b.kind === BreakpointKind.Source)
    .map(asSourceBreakpoint),
}))

const listFunctionBreakpoints = () => [...files.entries()].map(([ path, allBreakpoints ]) => ({
  source: { path, name: basename(path) },
  breakpoints: allBreakpoints
    .filter(b => b.kind === BreakpointKind.Function)
    .map(asFunctionBreakpoint)
    .filter(b => b.name)
}))

const list = () => [...files.values()].reduce((res, breakpoints) => {
  return [ ...res, ...breakpoints ]
}, []); }