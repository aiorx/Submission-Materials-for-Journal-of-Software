import { Translation } from '.'

export const Define = <T extends string>(array: T[]): T[] => array

export const Load = <T extends string, U = { [K in T]: Translation }>(
  locales: T[]
) => {
  const translations = {} as any
  for (let locale of locales) {
    translations[locale] = require(`./translations/${locale}.ts`).default
  }

  return translations as U
}
