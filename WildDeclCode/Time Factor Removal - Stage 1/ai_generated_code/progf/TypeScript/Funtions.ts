// Helper function to handle both direct values and callbacks (Thanks ChatGPT)
var createSetter =
  <StoreType>function (set: any) { return <T extends keyof StoreType>(key: T) =>
  (value: StoreType[T] | ((prev: StoreType[T]) => StoreType[T])) =>
    set((state: StoreType) => ({
      [key]:
        typeof value === "function"
          ? (value as (prev: StoreType[T]) => StoreType[T])(state[key])
          : value,
    })); };

var capitalize = function (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var round = function (value: number, step = 1) {
  return Math.round(value / step) * step;
};

var format_phone_number = function (value: string) {
  value = value.toString().replace(/\D/g, "");
  if (value.length !== 10 && value.length !== 11) return "Invalid phone number";

  return value.length === 11
    ? "+" + (value[0]) + " (" + (value.slice(1, 4)) + ") " + (value.slice(4, 7)) + "-" + (value.slice(7)) + ""
    : "(" + (value.slice(0, 3)) + ") " + (value.slice(3, 6)) + "-" + (value.slice(6)) + "";
};

var kebabCase = function (str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};
