// Aided with basic GitHub coding tools
// Injectable Content Extractor for PrismWeave Bookmarklet
// This module creates an injectable version using the shared ContentExtractionCore
// that can be loaded dynamically into web pages via script injection

var ContentExtractionCore = require('../utils/content-extraction-core.js').ContentExtractionCore;
var ICoreExtractionOptions = require('../utils/content-extraction-core.js').ICoreExtractionOptions;
var createLogger = require('../utils/logger.js').createLogger;
var MarkdownConverter = require('../utils/markdown-converter.js').MarkdownConverter;
var showToast = require('../utils/toast.js').showToast;

// Re-export and extend core options for injectable use
export interface IInjectableExtractionOptions extends ICoreExtractionOptions {
  includeImages?: boolean;
  includeLinks?: boolean;
}

export interface IInjectableContentResult {
  content: string;
  title: string;
  url: string;
  domain: string;
  html: string;
  markdown: string;
  frontmatter: string;
  metadata: Record<string, unknown>;
  images: string[];
  wordCount: number;
  readingTime: number;
  qualityScore: number;
  extractedAt: string;
  extractionMethod: 'injectable-advanced';
}

export interface IGitHubConfig {
  token: string;
  repository: string;
  folder?: string;
  commitMessage?: string;
}

export interface IGitHubCommitResult {
  success: boolean;
  data?: {
    sha: string;
    url: string;
    html_url: string;
  };
  error?: string;
}

/**
 * Injectable Content Extractor
 * Uses the sophisticated browser extension ContentExtractor in an injectable context
 */
class InjectableContentExtractor {
  private _core: ContentExtractionCore | null = null;
  private _markdownConverter: MarkdownConverter | null = null;
  private _logger: any;
  private _isInitialized: boolean = false;
  private _defaultOptions: IInjectableExtractionOptions = {
    cleanHtml: true,
    preserveFormatting: true,
    waitForDynamicContent: false,
    removeAds: true,
    removeNavigation: true,
    includeImages: true,
    includeLinks: true,
    customSelectors: [],
    excludeSelectors: [],
  };

  constructor(options: Partial<IInjectableExtractionOptions> = {}) {
    // Create a simple logger for injectable context
    this._logger = createLogger('InjectableExtractor');

    // Merge options with defaults for use during initialization
    this._defaultOptions = { ...this._defaultOptions, ...options };
  }

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    try {
      // Initialize the shared ContentExtractionCore (no constructor options)
      this._core = new ContentExtractionCore();
      this._markdownConverter = new MarkdownConverter();
      this._isInitialized = true;
      this._logger.info('Injectable content extractor initialized');
    } catch (error) {
      this._logger.error('Failed to initialize injectable extractor:', error);
      throw error;
    }
  }

  async extractAdvancedContent(
    options: Partial<IInjectableExtractionOptions> = {}
  ): Promise<IInjectableContentResult> {
    if (!this._isInitialized || !this._core || !this._markdownConverter) {
      await this.initialize();
    }

    try {
      this._logger.info('Starting advanced content extraction');

      // Merge provided options with defaults
      var finalOptions = { ...this._defaultOptions, ...options };

      // Use the shared core for content extraction
      var contentResult = await this._core!.extractContent(finalOptions);

      // Convert HTML to markdown using the sophisticated converter
      var markdownResult = this._markdownConverter!.convertToMarkdown(contentResult.content);
      var markdown = markdownResult.markdown;

      // Extract additional metadata using shared core methods
      var advancedMetadata = this._core!.extractAdvancedMetadata();

      // Extract images using shared core
      var imageResults = this._core!.extractImages();
      var images = imageResults.map(function img { return img.src; });

      // Calculate quality score using shared core
      var qualityScore = this._core!.getContentQualityScore();

      // Generate frontmatter
      var frontmatter = this._generateFrontmatter({
        title: contentResult.metadata.title,
        url: contentResult.metadata.url,
        domain: window.location.hostname,
        wordCount: contentResult.wordCount,
        extractedAt: new Date().toISOString(),
        metadata: advancedMetadata,
      });

      return {
        content: contentResult.content,
        title: contentResult.metadata.title,
        url: contentResult.metadata.url,
        domain: window.location.hostname,
        html: contentResult.content,
        markdown,
        frontmatter,
        metadata: {
          ...contentResult.metadata,
          ...advancedMetadata,
          extractedAt: new Date().toISOString(),
          qualityScore,
          extractionMethod: 'injectable-advanced',
        },
        images: images, // Already converted to string array above
        wordCount: contentResult.wordCount,
        readingTime: contentResult.readingTime,
        qualityScore,
        extractedAt: new Date().toISOString(),
        extractionMethod: 'injectable-advanced',
      };
    } catch (error) {
      this._logger.error('Advanced content extraction failed:', error);
      var errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error("Advanced extraction failed: " + (errorMessage) + "");
    }
  }

  private _generateFrontmatter(params: {
    title: string;
    url: string;
    domain: string;
    wordCount: number;
    extractedAt: string;
    metadata: Record<string, unknown>;
  }): string {
    var frontmatterLines = [
      '---',
      'title: "' + (params.title.replace(/"/g, '\\"')) + '"',
      'url: "' + (params.url) + '"',
      'domain: "' + (params.domain) + '"',
      'extracted_at: "' + (params.extractedAt) + '"',
      "word_count: " + (params.wordCount) + "",
      'extraction_method: "injectable-advanced"',
    ];

    // Add author if available
    if (params.metadata.author && typeof params.metadata.author === 'string') {
      frontmatterLines.push('author: "' + (params.metadata.author.replace(/"/g, '\\"')) + '"');
    }

    // Add description if available
    if (params.metadata.description && typeof params.metadata.description === 'string') {
      frontmatterLines.push('description: "' + (params.metadata.description.replace(/"/g, '\\"')) + '"');
    }

    // Add keywords/tags if available
    if (params.metadata.keywords && Array.isArray(params.metadata.keywords)) {
      var tags = params.metadata.keywords
        .map(function k { return '"' + (String(k).replace(/"/g, '\\"')) + '"'; })
        .join(', ');
      frontmatterLines.push("tags: [" + (tags) + "]");
    }

    frontmatterLines.push('---', '');
    return frontmatterLines.join('\n');
  }

  /**
   * Commit content directly to GitHub repository
   */
  async commitToGitHub(
    content: string,
    config: IGitHubConfig,
    filename?: string
  ): Promise<IGitHubCommitResult> {
    try {
      var extractionResult = await this.extractAdvancedContent();

      // Generate filename if not provided
      var finalFilename = filename || this._generateFilename(extractionResult.title);
      var folder = config.folder || 'documents';
      var filePath = "" + (folder) + "/" + (finalFilename) + "";

      // Combine frontmatter and markdown
      var fullContent = extractionResult.frontmatter + extractionResult.markdown;

      var commitMessage = (config.commitMessage || 'PrismWeave: Add {title}').replace(
        '{title}',
        extractionResult.title
      );

      // Check if file exists first (404 responses are expected for new files)
      var existingFileSha: string | undefined;
      try {
        var existingResponse = await fetch(
          "https://api.github.com/repos/" + (config.repository) + "/contents/" + (filePath) + "",
          {
            headers: {
              Authorization: "token " + (config.token) + "",
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'PrismWeave-Injectable/1.0',
            },
          }
        );

        if (existingResponse.ok) {
          var existingData = await existingResponse.json();
          existingFileSha = existingData.sha;
        } else if (existingResponse.status === 404) {
          // File doesn't exist yet - this is expected for new documents
          // The 404 error in browser console is normal GitHub API behavior
        } else {
          // Unexpected error status
          console.warn(
            "Unexpected response when checking file existence: " + (existingResponse.status) + ""
          );
        }
      } catch (error) {
        // Network error or other issue - file likely doesn't exist
      }

      // Create or update file
      var requestBody: any = {
        message: commitMessage,
        content: btoa(unescape(encodeURIComponent(fullContent))),
        branch: 'main',
      };

      if (existingFileSha) {
        requestBody.sha = existingFileSha;
      }

      var response = await fetch(
        "https://api.github.com/repos/" + (config.repository) + "/contents/" + (filePath) + "",
        {
          method: 'PUT',
          headers: {
            Authorization: "token " + (config.token) + "",
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'PrismWeave-Injectable/1.0',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        var errorData = await response.json().catch(function () { return ({}); });
        throw new Error(
          "GitHub API error: " + (response.status) + " - " + (errorData.message || 'Unknown error') + ""
        );
      }

      var result = await response.json();
      return {
        success: true,
        data: {
          sha: result.content.sha,
          url: result.content.url,
          html_url: result.content.html_url,
        },
      };
    } catch (error) {
      this._logger.error('GitHub commit failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private _generateFilename(title: string): string {
    var safeName = title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 40);

    var date = new Date().toISOString().slice(0, 10);
    return "" + (date) + "-" + (safeName) + ".md";
  }

  // Static methods for easy access
  static async extractContent(
    options: IInjectableExtractionOptions = {}
  ): Promise<IInjectableContentResult> {
    var extractor = new InjectableContentExtractor();
    return await extractor.extractAdvancedContent(options);
  }

  static async extractAndCommit(
    config: IGitHubConfig,
    options: IInjectableExtractionOptions = {},
    filename?: string
  ): Promise<IGitHubCommitResult> {
    var extractor = new InjectableContentExtractor();
    await extractor.initialize();
    var extractionResult = await extractor.extractAdvancedContent(options);

    // Generate filename if not provided
    var finalFilename = filename || extractor._generateFilename(extractionResult.title);
    var folder = config.folder || 'documents';
    var filePath = "" + (folder) + "/" + (finalFilename) + "";

    // Combine frontmatter and markdown
    var fullContent = extractionResult.frontmatter + extractionResult.markdown;

    return await extractor.commitToGitHub(fullContent, config, finalFilename);
  }
}

// Global registration for bookmarklet access
declare global {
  interface Window {
    PrismWeaveInjectableExtractor?: typeof InjectableContentExtractor;
    prismweaveExtractContent?: function (
      options?: IInjectableExtractionOptions
    ) { return Promise<IInjectableContentResult>; };
    prismweaveExtractAndCommit?: function (
      config: IGitHubConfig,
      options?: IInjectableExtractionOptions,
      filename?: string
    ) { return Promise<IGitHubCommitResult>; };
    prismweaveShowToast?: function (message: string, options?: any) { return void; };
  }
}

// Register globally for bookmarklet access
if (typeof window !== 'undefined') {
  window.PrismWeaveInjectableExtractor = InjectableContentExtractor;
  window.prismweaveExtractContent = InjectableContentExtractor.extractContent;
  window.prismweaveExtractAndCommit = InjectableContentExtractor.extractAndCommit;
  window.prismweaveShowToast = showToast;

  // Log successful injection
  console.log('🔗 PrismWeave Injectable Content Extractor loaded successfully');
}
