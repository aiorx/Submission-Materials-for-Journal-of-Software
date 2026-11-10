const createError = function (name: string) {
  return (message: string) => {
    const error = new Error(message);
    error.name = name;
    return error;
  };
};

module.exports = createError;

type WhotTypeError = InstanceType<typeof TypeError> & { type?: Function };
const createTypeError = function (name: string) {
  return (message: string, type: Function) => {
    const error: WhotTypeError = new TypeError(message);
    error.type = type;
    error.name = name;
    return error;
  };
};
