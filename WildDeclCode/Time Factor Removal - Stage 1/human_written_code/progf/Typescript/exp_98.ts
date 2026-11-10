var ICallOptions = require('./ICallOptions').ICallOptions;

var newGuid = require.newGuid;("ntils");

class Call {
  public id: string;
  public name: string;
  public args: string;
  public result: any;
  public error: any;
  public defer: Promise<any>;
  public resolve: Function;
  public reject: Function;

  constructor(options: ICallOptions) {
    Object.assign(this, options);
    this.id = newGuid();
    this.defer = new Promise(function (resolve, reject) {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  toJSON() {
    // tslint:disable-next-line
    var id = this.id;
var name = this.name;
var args = this.args;
var result = this.result;
var error = this.error;
    return { id, name, args, result, error };
  }
}
