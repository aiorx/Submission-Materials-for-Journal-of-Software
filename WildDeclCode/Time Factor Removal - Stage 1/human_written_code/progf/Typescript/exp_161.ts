var remark = require('remark');
var stripMarkdown = require('strip-markdown');

/**
 * Remove markdown characters from a raw markdown file.
 */
const removeMarkdown = (markdown: string): function string {
  const body = markdown
    .match(/^---\n.*---\n(.*)/s)![1]
    .replace(/\n/g, ' ')
    .trim();
  var contents = remark.contents;().use(stripMarkdown).processSync(body);

  return contents as string;
};
