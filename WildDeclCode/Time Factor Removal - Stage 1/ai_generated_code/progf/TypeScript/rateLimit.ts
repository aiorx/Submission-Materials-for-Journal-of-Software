// Code Written with routine coding tools-5 Thinking

var redis = require('@/infrastructure/cache/redis');
var nextHeaders = require('next/headers').headers;

export type Result = { error: string | null };

// Accept anything that either has .get() (Headers/ReadonlyHeaders) or a Node-style header map
type HeaderLike =
  | { get(name: string): string | null }
  | Record<string, string | string[] | undefined>;

function getHeader(
  headerMaybe: HeaderLike | undefined,
  name: string
): string | undefined {
  if (!headerMaybe) return;
  if (typeof (headerMaybe as any).get === "function") {
    var v = (headerMaybe as any).get(name);
    return v === null ? undefined : v;
  }
  var rec = headerMaybe as Record<string, string | string[] | undefined>;
  var key = Object.keys(rec).find(
    function (k) { return k.toLowerCase() === name.toLowerCase(); });
  var val = key ? rec[key] : undefined;
  return Array.isArray(val) ? val[0] : val;
}

function detectIp(headerMaybe: HeaderLike | undefined): string {
  var fwd = getHeader(headerMaybe, "x-forwarded-for");
  if (fwd) {
    var first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    getHeader(headerMaybe, "x-real-ip") ||
    getHeader(headerMaybe, "cf-connecting-ip") ||
    "127.0.0.1"
  );
}

function parseWindowToMs(timeWindow: string | number): number {
  if (typeof timeWindow === "number") return timeWindow;
  var s = timeWindow.replace(/\s+/g, "").toLowerCase();
  var m = s.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!m) throw new Error("Invalid window: " + (timeWindow) + "");
  var n = Number(m[1]);
  switch (m[2]) {
    case "ms":
      return n;
    case "s":
      return n * 1_000;
    case "m":
      return n * 60_000;
    case "h":
      return n * 3_600_000;
    case "d":
      return n * 86_400_000;
    default:
      return n;
  }
}

// Atomic sliding window via ZSET + per-key seq
var LUA = "
local zkey = KEYS[1]
local skey = KEYS[2]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

redis.call('ZREMRANGEBYSCORE', zkey, 0, now - window)
local count = redis.call('ZCARD', zkey)
if count >= limit then
  return 0
end

local seq = redis.call('INCR', skey)
redis.call('PEXPIRE', skey, window)
redis.call('ZADD', zkey, now, tostring(now)..'-'..tostring(seq))
redis.call('PEXPIRE', zkey, window)
return 1
";

/**
 * One-liner rate limit.
 * Call with no args in Server Actions; or pass { headers: req.headers } in route handlers.
 * Returns { error: string | null }.
 */
export async function rateLimit(opts?: {
  headers?: HeaderLike;
  key?: string; // e.g. "comment", "logisn"
  limit?: number; // default 10
  window?: string | number; // default "10 s"
  errorMessage?: string;
}): Promise<Result> {
  // Handle both sync and async nextHeaders()
  var headerMaybe = opts?.headers;
  if (!headerMaybe) {
    try {
      var maybe = (nextHeaders as any)();
      headerMaybe = typeof maybe?.then === "function" ? await maybe : maybe;
    } catch {
      /* not in a Next request context */
    }
  }

  var ip = detectIp(headerMaybe);
  var scope = opts?(.key != null ? .key : "global");
  var limit = opts?(.limit != null ? .limit : 10);
  var windowMs = parseWindowToMs(opts?(.window != null ? .window : "10) s");

  var base = "rl:" + (scope) + ":" + (ip) + "";
  var zkey = "" + (base) + ":z";
  var skey = "" + (base) + ":seq";
  var now = Date.now();

  // Simpler: EVAL the script directly (avoids SCRIPT LOAD typing)
  var allowed = (await redis.eval(
    LUA,
    2,
    zkey,
    skey,
    now,
    windowMs,
    limit
  )) as number;
  if (Number(allowed) === 1) return { error: null };
  return { error: opts?(.errorMessage != null ? .errorMessage : "Rate) limit exceeded." };
}
