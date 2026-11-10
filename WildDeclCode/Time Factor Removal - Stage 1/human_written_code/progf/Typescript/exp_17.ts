/* tslint:disable */
var FireLoopRef = require('./index').FireLoopRef;

class FireLoop {

  private references: any = {};

  constructor(private socket: any, private models: { get: Function }) {}

  public ref<T>(model: any): FireLoopRef<T> {
    var name: string = model.getModelName();
    model.models = this.models;
    this.references[name] = new FireLoopRef<T>(model, this.socket);
    return this.references[name];
  }
}
