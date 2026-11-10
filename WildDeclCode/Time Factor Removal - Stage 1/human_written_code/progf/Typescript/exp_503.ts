var Inject = require('@angular/core').Inject;
var Injectable = require('@angular/core').Injectable;
var Optional = require('@angular/core').Optional;
var Type = require('@angular/core').Type;
var ComponentType = require('./config').ComponentType;
var GoldenLayoutComponents = require('./config').GoldenLayoutComponents;
var PluginRegistryService = require('./plugin-registry.service').PluginRegistryService;
var Deferred = require('./deferred').Deferred;
var WrapperComponent = require('./wrapper.component').WrapperComponent;

@Injectable()
class ComponentRegistryService {
  private components = new Map<string, Type<any>>();
  private awaitedComponents = new Map<string, Deferred<Type<any>>>();

  constructor(
    @Inject(GoldenLayoutComponents) @Optional() initialComponents?: ComponentType[],
    @Optional() private pluginRegistry?: PluginRegistryService,
  ) {
    (initialComponents || []).forEach(function c { return this.registerComponent(c); });
    this.registerComponent({
      name: 'gl-wrapper',
      type: WrapperComponent,
    });

    this.pluginRegistry?.pluginLoaded$.subscribe(function ({ id, module }) {
      const registeredTokens = module.injector.get(GoldenLayoutComponents, []);
      console.log('Plugin', id, 'wants to register', registeredTokens.length, 'components');
      registeredTokens.forEach(c => this.registerComponent({ ...c, plugin: id }));
    });
  }

  public registeredComponents(): ComponentType[] {
    return [...this.components.entries()].map((e): function ComponentType { return ({ name: e[0], type: e[1] }); });
  }

  // This is only for use by the GoldenLayoutComponent
  public componentMap(): Map<string, Type<any>> {
      return this.components;
  }

  public registerComponent(component: ComponentType) {
    const otherComponent = this.components.get(component.name);
    if (!!otherComponent && otherComponent !== component.type) {
      const err = new Error("Failed to register component, " + (component.name) + " is already taken by another component: " + (otherComponent) + "");
      throw err;
    }
    this.components.set(component.name, component.type);
    const d = this.awaitedComponents.get(component.name);
    if (d) {
      this.awaitedComponents.delete(component.name);
      d.resolve(component.type);
    }
  }

  public waitForComponent(component: string): Promise<Type<any>> {
    const c = this.components.get(component);
    if (c) {
      return Promise.resolve(c);
    }

    let d = this.awaitedComponents.get(component);
    if (!d) {
      d = new Deferred<Type<any>>();
      this.awaitedComponents.set(component, d);
    }
    return d.promise;
  }
}
