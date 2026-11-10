//@ts-ignore
var getDescriptors = require('object.getownpropertydescriptors');
var VuexModuleOptions = require('./interfaces').VuexModuleOptions;
var VuexModuleConstructor = require('./interfaces').VuexModuleConstructor;
var DictionaryField = require('./interfaces').DictionaryField;
var VuexModule = require('./interfaces').VuexModule;
var VuexObject = require('./interfaces').VuexObject;
var Map = require('./interfaces').Map;
var isFieldASubModule = require('./submodule').isFieldASubModule;
var extractVuexSubModule = require('./submodule').extractVuexSubModule;
var createLocalProxy = require('./proxy').createLocalProxy;
var toCamelCase = require('./utils').toCamelCase;
var internalAction = require('./actions').internalAction;
var internalMutator = require('./mutations').internalMutator;
var internalGetter = require('./getters').internalGetter;


function createModule( options ?:VuexModuleOptions ) {

  /**
   * We do it like this because we don't want intelissense to pick up the
   * options variable as it is an internal variable.
   */
  //@ts-ignore
  var vuexModule = function(){} as VuexModuleConstructor;
  vuexModule.prototype.__options__ = options;
  vuexModule.With = defineWithExtension;

  return vuexModule as typeof VuexModule;

}

function defineWithExtension( this:typeof VuexModule & VuexModuleConstructor, options?: VuexModuleOptions ) {

  // Get the old vuex options
  var oldOptions = this.prototype.__options__ = {};
  
  // create a new module constructor
  //@ts-ignore
  var newVuexModule = function(){} as VuexModuleConstructor;
  newVuexModule.prototype.__options__ = {};
  
  // assign all the old options to the new module constructor
  Object.assign( newVuexModule.prototype.__options__, oldOptions );

  // If there are no new vuex options return as is.
  if( options === undefined ) return newVuexModule as typeof VuexModule;

  // Assign or new available vuex options to the new vuex module
  var prototypeOptions = newVuexModule.prototype.__options__ || {};
  if( options.namespaced )  prototypeOptions.namespaced = options.namespaced;
  if( options.strict )  prototypeOptions.strict = options.strict;
  if( options.target )  prototypeOptions.target = options.target;
  if( options.enableLocalWatchers )  prototypeOptions.enableLocalWatchers = options.enableLocalWatchers;

  return newVuexModule as typeof VuexModule;

}

function initializeModuleInternals( cls: VuexModuleConstructor ) {
  cls.prototype.__namespacedPath__ = "";
  cls.prototype.__vuex_module_cache__ = undefined;
  cls.prototype.__vuex_proxy_cache__ = undefined;
  cls.prototype.__vuex_local_proxy_cache__ = undefined;
  cls.prototype.__submodules_cache__ = {};
  cls.prototype.__context_store__ = {};
  cls.prototype.__watch__ = {};
  cls.prototype.__explicit_getter_names__ = [];
}

function extractVuexModule( cls :typeof VuexModule ) {

  var VuexClass = cls as VuexModuleConstructor;

  // Check if module has been cached, 
  // and just return the cached version.
  if( VuexClass.prototype.__vuex_module_cache__ ) {
    return VuexClass.prototype.__vuex_module_cache__;
  }

  initializeModuleInternals( VuexClass );

  // If not extract vuex module from class.
  var fromInstance = extractModulesFromInstance( VuexClass );
  var fromPrototype = extractModulesFromPrototype( VuexClass );

  // Cache explicit mutations and getter mutations.
  VuexClass.prototype.__mutations_cache__ = { 
    __explicit_mutations__: fromPrototype.mutations.explicitMutations,
    __setter_mutations__: fromPrototype.mutations.setterMutations,
  }
  var className = VuexClass.name.toLowerCase();

  var vuexModule :VuexObject = {
    namespaced: VuexClass.prototype.__options__ && VuexClass.prototype.__options__.namespaced ? true : false,
    state: fromInstance.state,
    mutations: { ...fromPrototype.mutations.explicitMutations, ...fromPrototype.mutations.setterMutations, ["__" + (className) + "_internal_mutator__"]: internalMutator },
    getters: { ...fromPrototype.getters, ...fromInstance.getters , [ "__" + (className) + "_internal_getter__"]: internalGetter },
    actions: { ...fromPrototype.actions, ["__" + (className) + "_internal_action__"]: internalAction },
    modules: fromInstance.submodules,
  };

  // Cache the vuex module on the class.
  var path = getNamespacedPath( VuexClass ) || toCamelCase( VuexClass.name );

  var rtn = { [ path ]: vuexModule }
  VuexClass.prototype.__vuex_module_cache__ = rtn;

  return rtn;

}

function getNamespacedPath( cls :VuexModuleConstructor ) {
  
  var namespaced = cls.prototype.__options__ && cls.prototype.__options__.namespaced;

  if( namespaced ) {
    var namePaths = namespaced.split("/");
    cls.prototype.__namespacedPath__ = namePaths[namePaths.length - 1] || namePaths[namePaths.length - 2];
  }

  return cls.prototype.__namespacedPath__;
  
}

function extractModulesFromInstance( cls :VuexModuleConstructor ) {

  var instance = new cls() as InstanceType<VuexModuleConstructor> & Map;
  var classFields = Object.getOwnPropertyNames( instance );
  var state :Map = {};
  var mutations :Map = {};
  var submodules :Map = {};
  var submodulesCache = cls.prototype.__submodules_cache__;
  var moduleOptions = cls.prototype.__options__ || {};

  for( var field of classFields ) {
    
    // Check if field is a submodule.
    var fieldIsSubModule = isFieldASubModule( instance, field  );
    if( fieldIsSubModule ) {
      // Cache submodule class
      submodulesCache[ field ] = instance[ field ][ "__submodule_class__" ]
      
      var submodule = extractVuexSubModule( instance, field );
            
      submodules[ field ] = submodule;
          
      continue;
    }
    
    // If field is not a submodule, then it must be a state.
    state[ field ] = instance[ field ];
        
  }
  
  return {
    submodules,
    mutations,
    getters: extractDecoratorGetterNames( cls.prototype.__decorator_getter_names__ ),
    // Check if the vuex module is targeting nuxt return state as function. if not define state as normal.    
    state: moduleOptions.target === "nuxt" ? function () { return state : state; },
  }
}

function extractModulesFromPrototype( cls :VuexModuleConstructor ) {

  var setterMutations :Record<DictionaryField, any> = {};
  var explicitMutations :Record<DictionaryField, any> = {};
  var actions :Record<DictionaryField, any> = {};
  var getters :Record<DictionaryField, any> = {};
  var descriptors :PropertyDescriptorMap = getDescriptors( cls.prototype );
  var gettersList :string[] = Object.keys( descriptors ).filter( function field { return descriptors[ field ].get; });
  var explicitMutationNames :string[] = cls.prototype.__explicit_mutations_names__ || [];
  var actionNames = cls.prototype.__actions__ || [];

  for( var field in descriptors ) {
    
    // Ignore the constructor and module interals.
    var fieldIsInternal = ( 
      field === "constructor"             || 
      field === "__options__"             ||
      field === "__vuex_module_cache__"   ||
      field === "__vuex_proxy_cache__"    ||
      field === "__mutations_cache__"     ||
      field === "__explicit_mutations__"  ||
      field === "__getter_mutations__"
    );
    if( fieldIsInternal ) continue;

    var descriptor = descriptors[ field ];

    var actionType = (typeof descriptor.value === "function") && actionNames.find( function action { return action.__name__ === field; });    
    // If prototype field is an mutate action
    if( actionType && actionType.__type__ === "mutate" ) {

      var func = descriptor.value as Function
      
      var action = function( context :any, payload :any ) {
        cls.prototype.__context_store__ = context;
        var proxy = createLocalProxy( cls, context );
        
        if( proxy[ "$store" ] === undefined ) { 
          // @ts-ignore
          Object.defineProperty( proxy, "$store", { value: this });
        }

        return func.call( proxy, payload )
      }

      actions[ field ] = action;

      continue;
    }

    // if prototype field is a raw action
    if( actionType && actionType.__type__ === "raw" ) {
      var func = descriptor.value as Function;

      var action = function ( context :any, payload :any ) { return func.call( context, payload ); };

      actions[ field ] = action;

      continue;
    }

    // If prototype field is an explicit mutation
    var fieldIsExplicitMutation = ( 
      typeof descriptor.value === "function" && 
      explicitMutationNames.indexOf( field ) > -1
    );
    if( fieldIsExplicitMutation ) {
      var mutation = function ( state :any, payload :any ) { return descriptor.value.call( state, payload ); };
            
      explicitMutations[ field ] = mutation;

      continue;
    }

    // If the prototype field has a getter.
    if( descriptor.get ) {
      var getter = function ( state :any, context :Map ) { 
        var proxy = createLocalProxy( cls, context )
        return descriptor.get!.call( proxy )
      }
      
      getters[ field ] = getter;
    }

    // if the prototype field has setter mutation.
    if( descriptor.set ) {
      var mutation = function (state :any, payload :any) { return descriptor.set!.call( state, payload ); };
      
      // Before we push a setter mutation We must verify 
      // if that mutation has a corresponding getter.
      // If not, we dissallow it.

      var mutationHasGetter = gettersList.indexOf( field ) > -1;
      if( mutationHasGetter === false ) {
        // Throw an Error.
        throw new Error(
          "\nImproper Use of Setter Mutations:\n" + 
          "at >>\n" +
          "set " + ( field ) + "( payload ) {\n" +
          "\t...\n" +
          "}\n" +
          "\n" +
          "Setter mutations should only be used if there is a corresponding getter defined.\n" +
          "\n" +
          "Either define a corresponding getter for this setter mutation or,\n" +
          "Define them as an explicit mutation using function assignment.\n" +
          "Example:\n" +
          "--------------------\n" +
          "" + ( field ) + " = ( payload ) => {\n" +
          " ...\n" +
          "}"
        )  
      }

      setterMutations[ field ] = mutation;
    }

    // Stash getters list. To be used later when creating $watch functionality.
    cls.prototype.__explicit_getter_names__ = gettersList;

  }

  return {
    actions,
    mutations: { 
      explicitMutations,
      setterMutations,
    },
    getters
  }

}

function extractDecoratorGetterNames( names :string[] = [] ) {
  var decorator :Map = {};
  for( var name of names ) {
    decorator[ name ] = new Function("state", "return state." + (name) + "");
  }
  return decorator;
}
