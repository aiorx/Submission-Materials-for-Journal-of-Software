// Aided using common development resources
//import "reflect-metadata";

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(function (item) { return deepClone(item); }) as any;
  }

  if (obj instanceof Map) {
    var clonedMap = new Map();
    for (var [key, value] of obj.entries()) {
      clonedMap.set(key, deepClone(value));
    }
    return clonedMap as any;
  }

  if (obj instanceof Set) {
    var clonedSet = new Set();
    for (var value of obj.values()) {
      clonedSet.add(deepClone(value));
    }
    return clonedSet as any;
  }

  var clonedObj: any = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }
  return clonedObj;
}

function deepMerge<T extends object, U extends object>(
  target: T,
  source: U,
): T & U {
  if (typeof target !== "object" || target === null)
    return deepClone(source) as T & U;
  if (typeof source !== "object" || source === null)
    return deepClone(target) as T & U;

  if (source instanceof Date) {
    return deepClone(source) as any;
  }

  if (source instanceof Map) {
    var mergedMap = new Map();
    var targetMap = target instanceof Map ? target : new Map();
    for (var [key, value] of (targetMap as any).entries()) {
      mergedMap.set(key, deepClone(value));
    }
    for (var [key, value] of (source as any).entries()) {
      mergedMap.set(key, deepClone(value));
    }
    return mergedMap as any;
  }

  if (source instanceof Set) {
    var mergedSet = new Set();
    var targetSet = target instanceof Set ? target : new Set();
    for (var value of (targetSet as any).values()) {
      mergedSet.add(deepClone(value));
    }
    for (var value of (source as any).values()) {
      mergedSet.add(deepClone(value));
    }
    return mergedSet as any;
  }

  var output: any = Array.isArray(target) ? [...target] : { ...target };

  if (Array.isArray(target) && Array.isArray(source)) {
    for (var item of source) {
      if (
        !output.some(
          function (existing: any) { return JSON.stringify(existing) === JSON.stringify(item); },
        )
      ) {
        output.push(deepClone(item));
      }
    }
    return output;
  }

  for (var key of Object.keys(source)) {
    var sourceValue = (source as any)[key];
    var targetValue = (target as any)[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (typeof sourceValue === "object" && sourceValue !== null) {
      output[key] = deepMerge(targetValue || {}, sourceValue);
    } else {
      output[key] = deepClone(sourceValue);
    }
  }

  return output;
}

/** Stack overflow
 * copy properties from from right to shallowMergeLeftFromRight
 * **/
/*export function copyPropertyValues<T extends Object, K extends keyof T>(
  s: Pick<T, K>,
  d: T,
  ks: K[] = Keys<T>() as K[],
) {
  console.log(ks);
  ks.forEach((k) => (d[k] = s[k]));
  return d;
}*/

/**
 * Replace values in left with values in right only including fields present in left.
 */
function shallowMergeLeftFromRight<OUT_TYPE>(
  left: OUT_TYPE & any,
  right: OUT_TYPE & any,
): OUT_TYPE {
  if (typeof left != "object" || typeof right != "object") {
    return right;
  }

  for (var key of Object.keys(left)) {
    if (typeof left[key] == "object") {
      left[key] = shallowMergeLeftFromRight(left[key], right[key]);
    } else {
      left[key] = right[key];
    }
  }

  return left;
}
