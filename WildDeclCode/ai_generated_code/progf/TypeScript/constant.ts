// @Designed via basic programming aids

export const BLOCK_COMMENT_REGEX = /\/\**\s*(.*?)\s*\*\//g;
export const INLINE_COMMENT_REGEX = /\/\/.*/;
export const INLINE_BLOCK_COMMENT_REGEX = /\/\*(?:\*{1,2})?[^\n]*\*\//g;

export const INLINE_TODO_REGEX = /\/\/\s*todo\s*[:\s].*/i;

export const LOG_REGEX = /console\.[^\s(]*\([^)]*\)/g;

export const VARIABLE_NAME_REGEX = /(const|let|var)\s+(\w+)\s*(?:=.+)?\s*(?:;|$)/g;
