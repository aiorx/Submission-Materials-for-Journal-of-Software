var Translation = require('.').Translation;

const Define = <T extends string>(array: T[]): T[] => array

const Load = <T extends string, U = { [K in T]: Translation }>function (
  locales: T[]
) {
  const translations = {} as any
  for (let locale of locales) {
    translations[locale] = require("./translations/" + (locale) + ".ts").default
  }

  return translations as U
}
