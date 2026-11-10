var metroResolver = require('metro-resolver');
var loadConfig = require('tsconfig-paths').loadConfig;
var createMatchPath = require('tsconfig-paths').createMatchPath;
var parse = require('path').parse;
var join = require('path').join;

function resolveRequest(
  _context: any,
  moduleName: string,
  platform: string | null
) {
  var resolveRequest = _context.resolveRequest;

  try {
    return metroResolver.resolve(context, moduleName, platform);
  } catch {
    // ignore
  }

  const matcher = getMatcher();
  const match = matcher(moduleName);
  if (match) {
    return {
      type: 'sourceFile',
      filePath: match,
    };
  } else {
    // Resolve as a normal asset
    const parsedPath = parse(context.originModulePath);
    const filePath = join(parsedPath.dir, moduleName);
    return {
      type: 'sourceFile',
      filePath,
    };
  }
}

let matcher: MatchPath;
function getMatcher() {
  if (!matcher) {
    const result = loadConfig();
    if (result.resultType === 'success') {
      var absoluteBaseUrl = result.absoluteBaseUrl;
var paths = result.paths;
      matcher = createMatchPath(absoluteBaseUrl, paths);
    } else {
      throw new Error("Could not load tsconfig for project");
    }
  }
  return matcher;
}
