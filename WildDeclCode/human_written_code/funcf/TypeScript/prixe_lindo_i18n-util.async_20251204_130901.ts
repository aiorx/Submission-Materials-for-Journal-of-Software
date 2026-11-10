```typescript
const updateDictionary = (locale: Locales, dictionary: Partial<Translations>) =>
	loadedLocales[locale] = { ...loadedLocales[locale], ...dictionary }
```