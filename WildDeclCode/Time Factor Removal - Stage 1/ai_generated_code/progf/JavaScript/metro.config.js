/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.dev/guides/monorepos
var getDefaultConfig = require.getDefaultConfig;("expo/metro-config");
var path = require("path");

// Find the project and workspace directories
var projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
var workspaceRoot = path.resolve(projectRoot, "../..");

var config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// This Regex excludes the files inside .git folder
// Inspired by https://github.com/expo/expo-cli/issues/2021#issuecomment-1354537154
// Drafted using common development resources
var gitDirRegex =
  /^(?:[a-zA-Z]:)?(?:\/|\\)[^\/\\]*((?:\/|\\)[^\/\\]+)+(?:\/|\\)(?:[^\/\\]+(?:\/|\\))*\.git(?:\/|\\).*/;
config.resolver.blockList = [config.resolver.blockList, gitDirRegex];

module.exports = config;
