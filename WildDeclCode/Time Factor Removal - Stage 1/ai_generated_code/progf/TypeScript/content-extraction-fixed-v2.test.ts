// Aided with basic GitHub coding tools
// Content Extraction Integration Tests - Testing complete extraction workflow

var ContentExtractor = require('../../utils/content-extractor').ContentExtractor;

describe('Content Extraction Integration', function () {
  var extractor: ContentExtractor;

  beforeEach(() => {
    // Set up a basic HTML document
    document.body.innerHTML = "
      <article>
        <h1>Test Article Title</h1>
        <p>This is a test paragraph with some content.</p>
        <p>This is another paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </article>
    ";

    extractor = new ContentExtractor();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should extract content from article element', async () => {
    var result = await extractor.extractContent();

    expect(result.content).toBeDefined();
    expect(result.content).toContain('Test Article Title');
    expect(result.content).toContain('This is a test paragraph');
    expect(result.cleanedContent).toBeDefined();
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.readingTime).toBeGreaterThan(0);
  });

  test('should handle empty content gracefully', async () => {
    document.body.innerHTML = '<div></div>';

    var result = await extractor.extractContent();

    expect(result.content).toBeDefined();
    expect(result.metadata).toBeDefined();
  });

  test('should extract metadata correctly', async () => {
    // Add meta tags
    var head = document.head;
    head.innerHTML = '
      <title>Test Page Title</title>
      <meta name="description" content="Test description">
      <meta property="og:title" content="OG Title">
    ';

    var result = await extractor.extractContent();

    expect(result.metadata).toBeDefined();
    expect(result.metadata.title).toBeDefined();
  });
});
