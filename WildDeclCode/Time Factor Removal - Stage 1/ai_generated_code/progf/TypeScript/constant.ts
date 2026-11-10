// @Designed via basic programming aids

var BLOCK_COMMENT_REGEX = /\/\**\s*(.*?)\s*\*\//g;
var INLINE_COMMENT_REGEX = /\/\/.*/;
var INLINE_BLOCK_COMMENT_REGEX = /\/\*(?:\*{1,2})?[^\n]*\*\//g;

var INLINE_TODO_REGEX = /\/\/\s*todo\s*[:\s].*/i;

var LOG_REGEX = /console\.[^\s(]*\([^)]*\)/g;

var VARIABLE_NAME_REGEX = /(const|let|var)\s+(\w+)\s*(?:=.+)?\s*(?:;|$)/g;
