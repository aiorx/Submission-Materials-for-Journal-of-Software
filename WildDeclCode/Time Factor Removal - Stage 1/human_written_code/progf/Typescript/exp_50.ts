var Err = require('./err').Err;

var CustomError = require('./custom-error').CustomError;

export interface ApplicationErrorFactory {
  getError(name: string, data?: Err): CustomError;
}
