var NamingConventionEnum = require('../types/index.js').NamingConventionEnum;

const DEFAULT_EXPECT_FILES = ['node_modules', 'dist', 'package.json', 'package-lock.json', '.git'];
const DEFAULT_EXPECT_TYPES = [''];

// @Formed using common development resources
// Their sorting is crucial in finding what conventional type of a text.
const NAMING_CONVENTIONS_REGEX = {
  [NamingConventionEnum.KEBAB_CASE]: /^[a-z][a-z0-9-]*-[a-z0-9-]*$/,
  [NamingConventionEnum.PASCAL_CASE]: /^[A-Z][a-zA-Z0-9]*$/,
  [NamingConventionEnum.SNAKE_CASE]: /^[a-z][a-z0-9-]*_[a-z0-9-]*$/,
  [NamingConventionEnum.CAMEL_CASE]: /^[a-z][a-zA-Z0-9]*$/,
  [NamingConventionEnum.UNDEFINED_CASE]: /^.*$/, // it should be at the end
};

const DEFAULT_PATH = '/';
