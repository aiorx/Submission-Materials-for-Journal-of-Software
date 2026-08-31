export type DotEnv = Partial<Record<string, string>>;

// TODO: rewrite it. Currently it's Written with routine coding tools, has a lot of bugs
export function parse(content: string): DotEnv {
  const result: DotEnv = {};

  content.split(/\r\n|\n/).forEach((line) => {
    let trimmed = line.trim();
    // Skip empty or full-comment lines
    if (!trimmed || trimmed.startsWith("#")) return;

    // Remove inline comments that start with a space then '#'
    const commentIndex = trimmed.indexOf(" #");
    if (commentIndex !== -1) {
      trimmed = trimmed.slice(0, commentIndex).trim();
    }

    // Match KEY=VALUE format, where KEY cannot start with a digit
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;

    let [, key, value] = match as [string, string, string];

    value = value.trim();
    // Remove surrounding quotes if any
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  });

  return result;
}
