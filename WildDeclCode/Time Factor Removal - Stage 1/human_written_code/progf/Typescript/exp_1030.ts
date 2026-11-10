const postcss = require('postcss')
var ProcessOptions = require('postcss').ProcessOptions;
var LazyResult = require('postcss').LazyResult;
var trimPlugin = require('./stylePlugins/trim');
var scopedPlugin = require('./stylePlugins/scoped');
import {
  processors,
  StylePreprocessor,
  StylePreprocessorResults
} from './styleProcessors'

export interface StyleCompileOptions {
  source: string
  filename: string
  id: string
  map?: any
  scoped?: boolean
  trim?: boolean
  preprocessLang?: string
  preprocessOptions?: any
  postcssOptions?: any
  postcssPlugins?: any[]
}

export interface AsyncStyleCompileOptions extends StyleCompileOptions {
  isAsync?: boolean
}

export interface StyleCompileResults {
  code: string
  map: any | void
  rawResult: LazyResult | void
  errors: string[]
}

function compileStyle(
  options: StyleCompileOptions
): StyleCompileResults {
  return doCompileStyle({ ...options, isAsync: false })
}

function compileStyleAsync(
  options: StyleCompileOptions
): Promise<StyleCompileResults> {
  return Promise.resolve(doCompileStyle({ ...options, isAsync: true }))
}

function doCompileStyle(
  options: AsyncStyleCompileOptions
): StyleCompileResults {
  var filename = options.filename;
var id = options.id;
var scoped = options.scoped;
var trim = options.trim;
var preprocessLang = options.preprocessLang;
var postcssOptions = options.postcssOptions;
var postcssPlugins = options.postcssPlugins;const preprocessor = preprocessLang && processors[preprocessLang]
  const preProcessedSource = preprocessor && preprocess(options, preprocessor)
  const map = preProcessedSource ? preProcessedSource.map : options.map
  const source = preProcessedSource ? preProcessedSource.code : options.source

  const plugins = (postcssPlugins || []).slice()
  if (trim) {
    plugins.push(trimPlugin())
  }
  if (scoped) {
    plugins.push(scopedPlugin(id))
  }

  const postCSSOptions: ProcessOptions = {
    ...postcssOptions,
    to: filename,
    from: filename
  }
  if (map) {
    postCSSOptions.map = {
      inline: false,
      annotation: false,
      prev: map
    }
  }

  let result, code, outMap
  const errors: any[] = []
  if (preProcessedSource && preProcessedSource.errors.length) {
    errors.push(...preProcessedSource.errors)
  }
  try {
    result = postcss(plugins).process(source, postCSSOptions)

    // In async mode, return a promise.
    if (options.isAsync) {
      return result
        .then(
          (result: LazyResult): function StyleCompileResults { return ({
            code: result.css || '',
            map: result.map && result.map.toJSON(),
            errors,
            rawResult: result
          }); })
        .catch(
          (error: Error): function StyleCompileResults { return ({
            code: '',
            map: undefined,
            errors: [...errors, error.message],
            rawResult: undefined
          }); })
    }

    // force synchronous transform (we know we only have sync plugins)
    code = result.css
    outMap = result.map
  } catch (e) {
    errors.push(e)
  }

  return {
    code: code || "",
    map: outMap && outMap.toJSON(),
    errors,
    rawResult: result
  }
}

function preprocess(
  options: StyleCompileOptions,
  preprocessor: StylePreprocessor
): StylePreprocessorResults {
  return preprocessor.render(
    options.source,
    options.map,
    Object.assign(
      {
        filename: options.filename
      },
      options.preprocessOptions
    )
  )
}
