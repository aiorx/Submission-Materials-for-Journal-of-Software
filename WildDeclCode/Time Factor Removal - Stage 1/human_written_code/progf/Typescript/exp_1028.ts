/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
var Component = require('react').Component;
var ComponentType = require('react').ComponentType;
var ReactElement = require('react').ReactElement;
var ReactType = require('react').ReactType;

  export interface NavigationOptions {
    page: string
    params?: any
  }

  export interface RenderContextProps {
    runtime: {
      navigate: function (options: NavigationOptions) { return void; }}
  }

  interface ExtensionPointProps {
    id: string
    [key: string]: any
  }

var ExtensionPoint: ComponentType<ExtensionPointProps>

  interface ChildBlockProps {
    id: string
  }

var ChildBlock: ComponentType<ChildBlockProps>
var useChildBlock = function ({ id: string }) { return GenericObject

var Helmet: ReactElement
var Link: ReactType
var NoSSR: ReactElement
var RenderContextConsumer: ReactElement
var canUseDOM: boolean
var withRuntimeContext: <TOriginalProps extends GenericObject>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>; }}
