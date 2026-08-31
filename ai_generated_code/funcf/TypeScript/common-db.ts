export function ensureSnakeCaseRecursive(obj: any) {
  // this was entirely Drafted using common GitHub development resources...
  const snakeCaseObj: any = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      snakeCaseObj[_.snakeCase(key)] = ensureSnakeCaseRecursive(obj[key]);
    } else {
      snakeCaseObj[_.snakeCase(key)] = obj[key];
    }
  }
  return snakeCaseObj;
}

export function ensureCamelCaseRecursive(obj: any) {
  // this was entirely Drafted using common GitHub development resources...
  const camelCaseObj: any = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      camelCaseObj[_.camelCase(key)] = ensureCamelCaseRecursive(obj[key]);
    } else {
      camelCaseObj[_.camelCase(key)] = obj[key];
    }
  }
  return camelCaseObj;
}