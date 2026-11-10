// Supported via standard GitHub programming aids
// Content Capture Service - Unified service for content extraction, processing, and capture
// Consolidates ContentExtractionManager, PageCaptureManager, and DocumentProcessor

import {
  ICaptureResult,
  IContentExtractionData,
  IContentExtractionResult,
  IDocumentMetadata,
  ISettings,
} from '../types/types.js';
var FileManager = require('./file-manager.js').FileManager;
var IGitHubSettings = require('./file-manager.js').IGitHubSettings;
var createLogger = require('./logger.js').createLogger;
var SettingsManager = require('./settings-manager.js').SettingsManager;
var SharedUtils = require('./shared-utils.js');

var logger = createLogger('ContentCaptureService');

/**
 * Options for content extraction
 */
export interface IContentExtractor {
  extractContent(tabId: number): Promise<IContentExtractionResult>;
}

/**
 * Options for document processing
 */
export interface IDocumentProcessor {
  processDocument(
    content: string,
    title: string,
    url: string,
    metadata: Record<string, unknown>,
    settings: Partial<ISettings>
  ): IProcessedDocument;
}

/**
 * Capture options interface
 */
export interface ICaptureServiceOptions {
  // Content extraction options
  includeImages?: boolean;
  preserveFormatting?: boolean;
  customSelectors?: string[];
  excludeSelectors?: string[];

  // Capture workflow options
  validateSettings?: boolean;
  includeMarkdown?: boolean;
  forceGitHubCommit?: boolean;
  maxFilenameLength?: number;
  filenamePattern?: string;
}

/**
 * Processed document interface
 */
export interface IProcessedDocument {
  filename: string;
  filePath: string;
  folder: string;
  content: string;
  metadata: IDocumentMetadata;
}

/**
 * Unified Content Capture Service
 *
 * This service consolidates the functionality of:
 * - ContentExtractionManager: Content extraction with fallback strategies
 * - PageCaptureManager: Complete page capture workflow
 * - DocumentProcessor: Document processing and organization
 */
class ContentCaptureService implements IContentExtractor, IDocumentProcessor {
  // Extraction constants
  private static readonly CONTENT_SCRIPT_TIMEOUT = 10000; // 10 seconds
  private static readonly PING_TIMEOUT = 1000; // 1 second
  private static readonly SCRIPT_INIT_DELAY = 500; // 500ms

  // Processing constants
  private static readonly DEFAULT_FOLDER = 'unsorted';
  private static readonly DEFAULT_FILENAME_PATTERN = 'YYYY-MM-DD-domain-title';

  // Folder classification mapping
  private static readonly FOLDER_MAPPING: Record<string, string[]> = {
    tech: [
      'programming',
      'software',
      'coding',
      'development',
      'technology',
      'tech',
      'javascript',
      'python',
      'react',
      'node',
      'github',
      'stackoverflow',
      'dev.to',
      'css',
      'html',
      'typescript',
      'api',
      'framework',
      'library',
    ],
    business: [
      'business',
      'marketing',
      'finance',
      'startup',
      'entrepreneur',
      'sales',
      'management',
      'strategy',
      'linkedin',
      'enterprise',
      'corporate',
      'economics',
      'market',
      'revenue',
      'profit',
    ],
    tutorial: [
      'tutorial',
      'guide',
      'how-to',
      'learn',
      'course',
      'lesson',
      'walkthrough',
      'step-by-step',
      'instructions',
      'tips',
      'howto',
      'example',
    ],
    news: [
      'news',
      'article',
      'blog',
      'opinion',
      'analysis',
      'update',
      'announcement',
      'breaking',
      'report',
      'current',
      'events',
    ],
    research: [
      'research',
      'study',
      'paper',
      'academic',
      'journal',
      'thesis',
      'analysis',
      'data',
      'science',
      'experiment',
      'findings',
      'methodology',
    ],
    design: [
      'design',
      'ui',
      'ux',
      'css',
      'figma',
      'adobe',
      'creative',
      'visual',
      'art',
      'layout',
      'typography',
      'color',
      'interface',
    ],
    tools: [
      'tool',
      'utility',
      'software',
      'app',
      'service',
      'platform',
      'extension',
      'plugin',
      'resource',
      'toolkit',
    ],
    personal: [
      'personal',
      'diary',
      'journal',
      'thoughts',
      'reflection',
      'life',
      'experience',
      'blog',
      'opinion',
    ],
    reference: [
      'reference',
      'documentation',
      'manual',
      'spec',
      'api',
      'docs',
      'wiki',
      'handbook',
      'guide',
    ],
  };

  private fileManager: FileManager;
  private settingsManager: SettingsManager;

  constructor(settingsManager: SettingsManager) {
    this.fileManager = new FileManager();
    this.settingsManager = settingsManager;
  }

  // =================================================================
  // MAIN CAPTURE WORKFLOW (from PageCaptureManager)
  // =================================================================

  /**
   * Capture and process a page from the active tab
   */
  async capturePage(
    data?: Record<string, unknown>,
    options: ICaptureServiceOptions = {}
  ): Promise<ICaptureResult> {
    try {
      logger.info('Starting page capture workflow with options:', options);

      // Step 1: Validate settings
      logger.debug('Starting settings validation...');
      var shouldValidateSettings = (options.validateSettings != null ? options.validateSettings : false);
      var settings = await this.validateAndGetSettings(shouldValidateSettings);
      logger.debug('Settings validation completed successfully');

      // Step 2: Get active tab
      logger.debug('Getting active tab...');
      var activeTab = await this.getActiveTab();
      var tabId = activeTab.id!;
      logger.debug('Active tab obtained:', {
        url: activeTab.url,
        title: activeTab.title,
        id: tabId,
      });

      // Step 3: Extract content or use provided content
      var extractionResult: IContentExtractionResult;

      if (data && data.extractedContent) {
        // Use content provided by caller (e.g., from content script)
        logger.debug('Using pre-extracted content from request data');
        extractionResult = {
          success: true,
          data: data.extractedContent as IContentExtractionData,
          extractionMethod: 'pre-extracted',
          timestamp: new Date().toISOString(),
        };
      } else {
        // Extract content using service worker
        logger.debug('Extracting content via service worker...');
        extractionResult = await this.extractContent(tabId);
      }

      logger.debug('Content extraction result received:', {
        success: extractionResult.success,
        hasData: !!extractionResult.data,
        error: extractionResult.error,
        extractionMethod: extractionResult.extractionMethod,
      });

      if (!extractionResult.success || !extractionResult.data) {
        var errorMsg = extractionResult.error || 'Content extraction failed';
        logger.error('Content extraction failed:', { error: errorMsg, extractionResult });
        throw new Error(errorMsg);
      }

      var markdown = extractionResult.data.markdown;
var frontmatter = extractionResult.data.frontmatter;
var title = extractionResult.data.title;
var url = extractionResult.data.url;
var metadata = extractionResult.data.metadata;

      logger.debug('Extracted content details:', {
        hasMarkdown: !!markdown,
        markdownLength: markdown?.length || 0,
        hasFrontmatter: !!frontmatter,
        frontmatterLength: frontmatter?.length || 0,
        hasHtml: !!extractionResult.data.html,
        htmlLength: extractionResult.data.html?.length || 0,
        title: title || 'no title',
        url: url || 'no url',
      });

      // Step 4: Validate content
      logger.debug('Content validation check:', {
        hasMarkdown: !!markdown,
        markdownValue: markdown,
        markdownType: typeof markdown,
        markdownLength: markdown?.length || 0,
        hasHtml: !!extractionResult.data.html,
        htmlValue: extractionResult.data.html,
        htmlType: typeof extractionResult.data.html,
        htmlLength: extractionResult.data.html?.length || 0,
        extractionDataKeys: Object.keys(extractionResult.data || {}),
        fullExtractionData: extractionResult.data,
      });

      // Check for meaningful content (not just empty strings)
      var hasValidMarkdown = markdown && markdown.trim().length > 0;
      var hasValidHtml =
        extractionResult.data.html && extractionResult.data.html.trim().length > 0;

      if (!hasValidMarkdown && !hasValidHtml) {
        logger.error('Content validation failed - no meaningful markdown and no meaningful HTML:', {
          markdown: markdown,
          markdownTrimmed: markdown?.trim(),
          html: extractionResult.data.html,
          htmlTrimmed: extractionResult.data.html?.trim(),
          extractionData: extractionResult.data,
          extractionResult: extractionResult,
        });
        throw new Error('No meaningful content extracted from page');
      }

      // Step 5: Process document
      logger.debug('Starting document processing...');
      var finalContent = (frontmatter || '') + (markdown || '');
      logger.debug('Final content prepared:', {
        frontmatterLength: frontmatter?.length || 0,
        markdownLength: markdown?.length || 0,
        finalContentLength: finalContent.length,
      });

      var processedDoc = this.processDocument(
        finalContent,
        title || activeTab.title || 'Untitled',
        url || activeTab.url || '',
        metadata || {},
        settings
      );

      logger.debug('Document processed successfully:', {
        filename: processedDoc.filename,
        folder: processedDoc.folder,
        contentLength: processedDoc.content.length,
      });

      // Step 6: Handle GitHub commit if enabled
      var shouldCommit =
        options.forceGitHubCommit ||
        (settings.autoCommit && settings.githubToken && settings.githubRepo);

      if (shouldCommit) {
        logger.info('Committing to GitHub repository');
        var commitResult = await this.commitToGitHub(processedDoc, settings);

        if (commitResult.success) {
          return this.createSuccessResult(processedDoc, {
            message: 'Page captured and committed to repository',
            ...(commitResult.url && { commitUrl: commitResult.url }),
            ...(options.includeMarkdown !== undefined && {
              includeMarkdown: options.includeMarkdown,
            }),
          });
        } else {
          logger.warn('GitHub commit failed, falling back to local storage:', commitResult.error);
        }
      }

      // Step 7: Fallback to local storage
      await this.storeLocally(processedDoc);

      return this.createSuccessResult(processedDoc, {
        message: 'Page captured and stored locally (pending sync)',
        status: 'pending_sync',
        ...(options.includeMarkdown !== undefined && { includeMarkdown: options.includeMarkdown }),
      });
    } catch (error) {
      logger.error('Error in page capture workflow:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Capture and process a page from a provided URL (for link capture)
   */
  async captureLink(
    linkUrl: string,
    data?: Record<string, unknown>,
    options: ICaptureServiceOptions = {}
  ): Promise<ICaptureResult> {
    try {
      logger.info('Starting direct HTML fetch for URL:', linkUrl, 'with options:', options);

      // Step 1: Validate settings
      logger.debug('Starting settings validation...');
      var shouldValidateSettings = (options.validateSettings != null ? options.validateSettings : false);
      var settings = await this.validateAndGetSettings(shouldValidateSettings);
      logger.debug('Settings validation completed successfully');

      // Step 2: Directly fetch HTML content from the URL
      logger.debug('Fetching HTML content directly from URL:', linkUrl);
      var htmlFetchResult = await this.fetchHtmlContent(linkUrl);

      if (!htmlFetchResult.success || !htmlFetchResult.html) {
        throw new Error(htmlFetchResult.error || 'Failed to fetch HTML content');
      }

      // Step 3: Extract content from the HTML
      logger.debug('Extracting content from fetched HTML...');
      var extractionResult = await this.extractContentFromHtml(
        htmlFetchResult.html,
        linkUrl,
        htmlFetchResult.title || undefined
      );

      if (!extractionResult.success || !extractionResult.data) {
        throw new Error(extractionResult.error || 'Content extraction failed');
      }

      var markdown = extractionResult.data.markdown;
var frontmatter = extractionResult.data.frontmatter;
var title = extractionResult.data.title;
var url = extractionResult.data.url;
var metadata = extractionResult.data.metadata;

      logger.debug('Final extracted content details:', {
        hasMarkdown: !!markdown,
        markdownLength: markdown?.length || 0,
        hasFrontmatter: !!frontmatter,
        frontmatterLength: frontmatter?.length || 0,
        hasHtml: !!extractionResult.data.html,
        htmlLength: extractionResult.data.html?.length || 0,
        title: title || 'no title',
        url: url || 'no url',
      });

      // Step 4: Enhanced content validation with more lenient checks
      var hasMarkdown = markdown && markdown.trim().length > 10;
      var hasHtml = extractionResult.data.html && extractionResult.data.html.trim().length > 20;
      var hasTitle = title && title.trim().length > 0;

      if (!hasMarkdown && !hasHtml) {
        logger.error('Content validation failed - insufficient content:', {
          markdown: markdown?.substring(0, 100) + '...' || 'none',
          html: extractionResult.data.html?.substring(0, 100) + '...' || 'none',
          hasTitle,
          title: title || 'none',
        });
        throw new Error('Insufficient content extracted from link');
      }

      // Step 5: Process document with fallback content handling
      logger.debug('Starting document processing...');
      var finalContent: string;

      if (hasMarkdown) {
        finalContent = (frontmatter || '') + (markdown || '');
      } else if (hasHtml) {
        // If we only have HTML, create basic markdown from it
        var basicMarkdown = this.basicHtmlToMarkdown(extractionResult.data.html!);
        var basicFrontmatter = this.generateBasicFrontmatter(title, url || linkUrl);
        finalContent = basicFrontmatter + '\n' + basicMarkdown;
      } else {
        // Last resort: create minimal content
        var fallbackContent = "# " + (title || 'Captured Link') + "\n\n**URL:** " + (url || linkUrl) + "\n\n**Captured:** " + (new Date().toISOString()) + "\n\n*Content extraction was limited for this page.*";
        var basicFrontmatter = this.generateBasicFrontmatter(title, url || linkUrl);
        finalContent = basicFrontmatter + '\n' + fallbackContent;
      }

      logger.debug('Final content prepared:', {
        finalContentLength: finalContent.length,
        hasContent: finalContent.length > 100,
      });

      var processedDoc = this.processDocument(
        finalContent,
        title || 'Untitled',
        url || linkUrl,
        metadata || {},
        settings
      );

      logger.debug('Document processed successfully:', {
        filename: processedDoc.filename,
        folder: processedDoc.folder,
        contentLength: processedDoc.content.length,
      });

      // Step 6: Handle GitHub commit if enabled
      var shouldCommit =
        options.forceGitHubCommit ||
        (settings.autoCommit && settings.githubToken && settings.githubRepo);

      if (shouldCommit) {
        logger.info('Committing to GitHub repository');
        var commitResult = await this.commitToGitHub(processedDoc, settings);

        if (commitResult.success) {
          return this.createSuccessResult(processedDoc, {
            message: 'Link content captured and committed to repository',
            ...(commitResult.url && { commitUrl: commitResult.url }),
            ...(options.includeMarkdown !== undefined && {
              includeMarkdown: options.includeMarkdown,
            }),
          });
        } else {
          logger.warn('GitHub commit failed, falling back to local storage:', commitResult.error);
        }
      }

      // Step 7: Fallback to local storage
      await this.storeLocally(processedDoc);

      return this.createSuccessResult(processedDoc, {
        message: 'Link content captured and stored locally (pending sync)',
        status: 'pending_sync',
        ...(options.includeMarkdown !== undefined && {
          includeMarkdown: options.includeMarkdown,
        }),
      });
    } catch (error) {
      logger.error('Error in link capture workflow:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Fetch HTML content directly from a URL using the fetch API
   */
  private async fetchHtmlContent(url: string): Promise<{
    success: boolean;
    html?: string;
    title?: string;
    error?: string;
  }> {
    try {
      logger.debug('Starting direct HTML fetch for URL:', url);

      // Set up fetch with reasonable timeout and headers
      var controller = new AbortController();
      var timeoutId = setTimeout(function () { return controller.abort(); }, 15000); // 15 second timeout

      var response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("HTTP " + (response.status) + ": " + (response.statusText) + "");
      }

      var html = await response.text();
      logger.debug('HTML fetch successful:', {
        url,
        statusCode: response.status,
        contentLength: html.length,
        contentType: response.headers.get('content-type'),
      });

      // Extract title from HTML
      var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      var pageTitle = titleMatch ? titleMatch[1].trim() : undefined;

      return {
        success: true,
        html,
        ...(pageTitle && { title: pageTitle }),
      };
    } catch (error) {
      var errorMessage = error instanceof Error ? error.message : 'Unknown fetch error';
      logger.error('HTML fetch failed:', { url, error: errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Extract content from HTML string (without creating a tab)
   */
  private async extractContentFromHtml(
    html: string,
    sourceUrl: string,
    pageTitle?: string
  ): Promise<IContentExtractionResult> {
    try {
      logger.debug('Starting HTML content extraction');

      // Check if DOMParser is available (not available in service worker context)
      if (typeof DOMParser === 'undefined') {
        logger.debug('DOMParser not available, using regex-based extraction');
        return this.extractContentWithRegex(html, sourceUrl, pageTitle);
      }

      // Create a DOM parser to process the HTML
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      // Extract title if not provided
      var title = pageTitle;
      if (!title) {
        var titleElement = doc.querySelector('title');
        title = titleElement?.textContent?.trim() || 'Untitled';
      }

      // Extract main content using semantic selectors
      var contentSelectors = [
        'article',
        'main',
        '[role="main"]',
        '.content',
        '.post',
        '.entry',
        '#content',
        '#main',
        '.main-content',
        '.post-content',
        '.entry-content',
      ];

      var contentElement: Element | null = null;
      for (var selector of contentSelectors) {
        contentElement = doc.querySelector(selector);
        if (
          contentElement &&
          contentElement.textContent &&
          contentElement.textContent.trim().length > 100
        ) {
          logger.debug('Found content using selector:', selector);
          break;
        }
      }

      // Fallback to body if no specific content area found
      if (!contentElement) {
        contentElement = doc.body;
        logger.debug('Using document body as content element');
      }

      // Clean the content
      if (contentElement) {
        // Remove script and style elements
        var unwantedElements = contentElement.querySelectorAll('script, style, noscript, iframe');
        unwantedElements.forEach(function el { return el.remove(); });

        // Remove common unwanted sections
        var unwantedSelectors = [
          '.advertisement',
          '.ad',
          '.ads',
          '.popup',
          '.modal',
          '.overlay',
          '.social-share',
          '.comments',
          '.related-posts',
          '.sidebar',
          '.navigation',
          '.nav',
          '[style*="display: none"]',
          '[style*="visibility: hidden"]',
        ];

        unwantedSelectors.forEach(function selector {
          var elements = contentElement!.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
      }

      var cleanHtml = contentElement?.innerHTML || '';

      // Convert to markdown using basic HTML-to-markdown conversion
      var markdown = this.basicHtmlToMarkdown(cleanHtml);

      // Extract metadata
      var metadata = this.extractMetadataFromHtml(doc, sourceUrl);

      // Extract images
      var images = this.extractImagesFromHtml(doc, sourceUrl);

      // Generate frontmatter
      var frontmatter = this.generateBasicFrontmatter(title, sourceUrl);

      logger.debug('HTML content extraction completed:', {
        title,
        htmlLength: cleanHtml.length,
        markdownLength: markdown.length,
        imageCount: images.length,
        hasMetadata: Object.keys(metadata).length > 0,
      });

      return {
        success: true,
        data: {
          html: cleanHtml,
          markdown,
          frontmatter,
          title,
          url: sourceUrl,
          metadata,
          images,
        },
        extractionMethod: 'direct',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      var errorMessage = error instanceof Error ? error.message : 'Unknown extraction error';
      logger.error('HTML content extraction failed:', { error: errorMessage });

      return {
        success: false,
        error: errorMessage,
        extractionMethod: 'direct',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Extract metadata from HTML document
   */
  private extractMetadataFromHtml(doc: Document, sourceUrl: string): Record<string, unknown> {
    var metadata: Record<string, unknown> = {};

    // Extract Open Graph metadata
    doc.querySelectorAll('meta[property^="og:"]').forEach(function meta {
      var property = meta.getAttribute('property');
      var content = meta.getAttribute('content');
      if (property && content) {
        metadata[property] = content;
      }
    });

    // Extract Twitter Card metadata
    doc.querySelectorAll('meta[name^="twitter:"]').forEach(function meta {
      var name = meta.getAttribute('name');
      var content = meta.getAttribute('content');
      if (name && content) {
        metadata[name] = content;
      }
    });

    // Extract standard meta tags
    doc.querySelectorAll('meta[name]').forEach(function meta {
      var name = meta.getAttribute('name');
      var content = meta.getAttribute('content');
      if (name && content && ['description', 'keywords', 'author'].includes(name)) {
        metadata[name] = content;
      }
    });

    // Add extraction information
    metadata.url = sourceUrl;
    metadata.domain = new URL(sourceUrl).hostname;
    metadata.extractedAt = new Date().toISOString();
    metadata.extractionMethod = 'direct-html-fetch';

    return metadata;
  }

  /**
   * Extract images from HTML document
   */
  private extractImagesFromHtml(doc: Document, sourceUrl: string): string[] {
    try {
      var images: string[] = [];
      var imgElements = doc.querySelectorAll('img');

      imgElements.forEach(function img {
        var src = img.src;
        if (src && !src.startsWith('data:') && src.length > 0) {
          try {
            // Convert relative URLs to absolute
            var absoluteUrl = new URL(src, sourceUrl).href;
            if (!images.includes(absoluteUrl)) {
              images.push(absoluteUrl);
            }
          } catch (error) {
            // Skip invalid URLs
            logger.debug('Skipping invalid image URL:', src);
          }
        }
      });

      logger.debug('Extracted images from HTML document:', {
        imageCount: images.length,
        sourceUrl,
      });

      return images;
    } catch (error) {
      logger.warn('Image extraction from HTML document failed:', error);
      return []; // Return empty array on failure - don't throw error
    }
  }

  /**
   * Basic HTML to Markdown converter for direct HTML extraction
   */
  private basicHtmlToMarkdown(html: string): string {
    if (!html) return '';

    var markdown = html;

    // Headers
    markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, function (match, level, content) {
      var headerLevel = '#'.repeat(parseInt(level));
      return "\n" + (headerLevel) + " " + (this.stripHtml(content)) + "\n";
    });

    // Paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');

    // Strong/Bold
    markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');

    // Emphasis/Italic
    markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');

    // Links
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images
    markdown = markdown.replace(
      /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      '![$2]($1)'
    );
    markdown = markdown.replace(
      /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi,
      '![$1]($2)'
    );
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)');

    // Lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, function (match, content) {
      var items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      return "\n" + (items) + "\n";
    });

    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, function (match, content) {
      var counter = 1;
      var items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => "" + (counter++) + ". $1\n");
      return "\n" + (items) + "\n";
    });

    // Code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '\n```\n$1\n```\n');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, function (match, content) {
      var lines = this.stripHtml(content).split('\n');
      return '\n' + lines.map(line => "> " + (line) + "").join('\n') + '\n';
    });

    // Line breaks
    markdown = markdown.replace(/<br[^>]*>/gi, '\n');

    // Strip remaining HTML
    markdown = this.stripHtml(markdown);

    // Clean up whitespace
    markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
  }

  /**
   * Strip HTML tags from a string
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Extract content using regex patterns (fallback for service worker context)
   */
  private extractContentWithRegex(
    html: string,
    sourceUrl: string,
    pageTitle?: string
  ): IContentExtractionResult {
    try {
      logger.debug('Using regex-based HTML content extraction');

      // Extract title if not provided
      var title = pageTitle;
      if (!title) {
        var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        title = titleMatch ? titleMatch[1].trim() : 'Untitled';
      }

      // Try to extract main content using regex patterns
      var contentHtml = '';

      // Content extraction patterns (in order of preference)
      var contentPatterns = [
        /<article[^>]*>(.*?)<\/article>/is,
        /<main[^>]*>(.*?)<\/main>/is,
        /<div[^>]*role=["']main["'][^>]*>(.*?)<\/div>/is,
        /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>(.*?)<\/div>/is,
        /<div[^>]*class=["'][^"']*post[^"']*["'][^>]*>(.*?)<\/div>/is,
        /<div[^>]*class=["'][^"']*entry[^"']*["'][^>]*>(.*?)<\/div>/is,
        /<div[^>]*id=["']content["'][^>]*>(.*?)<\/div>/is,
      ];

      for (var pattern of contentPatterns) {
        var match = html.match(pattern);
        if (match && match[1] && match[1].trim().length > 100) {
          contentHtml = match[1];
          logger.debug('Found content using regex pattern');
          break;
        }
      }

      // Fallback to body content if no specific content area found
      if (!contentHtml) {
        var bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
        contentHtml = bodyMatch ? bodyMatch[1] : html;
        logger.debug('Using body content as fallback');
      }

      // Remove unwanted elements
      contentHtml = this.removeUnwantedElements(contentHtml);

      // Convert to markdown
      var markdown = this.basicHtmlToMarkdown(contentHtml);

      // Extract metadata using regex-based approach
      var metadata = this.extractMetadataWithRegex(html, sourceUrl);

      // Extract images using regex (safe extraction)
      var images = this.extractImagesWithRegex(html, sourceUrl);

      // Generate frontmatter
      var frontmatter = this.generateBasicFrontmatter(title, sourceUrl);

      return {
        success: true,
        data: {
          html: contentHtml,
          markdown,
          frontmatter,
          title,
          url: sourceUrl,
          metadata,
          images,
        },
        extractionMethod: 'direct',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Regex-based content extraction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Regex extraction failed',
        extractionMethod: 'basic-fallback',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Remove unwanted elements from HTML using regex
   */
  private removeUnwantedElements(html: string): string {
    // Remove script and style tags
    html = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
    html = html.replace(/<style[^>]*>.*?<\/style>/gis, '');
    html = html.replace(/<noscript[^>]*>.*?<\/noscript>/gis, '');

    // Remove common unwanted sections
    var unwantedPatterns = [
      /<div[^>]*class=["'][^"']*advertisement[^"']*["'][^>]*>.*?<\/div>/gis,
      /<div[^>]*class=["'][^"']*\bad\b[^"']*["'][^>]*>.*?<\/div>/gis,
      /<div[^>]*class=["'][^"']*ads[^"']*["'][^>]*>.*?<\/div>/gis,
      /<div[^>]*class=["'][^"']*popup[^"']*["'][^>]*>.*?<\/div>/gis,
      /<div[^>]*class=["'][^"']*modal[^"']*["'][^>]*>.*?<\/div>/gis,
      /<nav[^>]*>.*?<\/nav>/gis,
      /<header[^>]*>.*?<\/header>/gis,
      /<footer[^>]*>.*?<\/footer>/gis,
    ];

    unwantedPatterns.forEach(function pattern {
      html = html.replace(pattern, '');
    });

    return html;
  }

  /**
   * Extract metadata from HTML using regex patterns (fallback for service worker)
   */
  private extractMetadataWithRegex(html: string, sourceUrl: string): Record<string, unknown> {
    var metadata: Record<string, unknown> = {};

    // Extract Open Graph metadata
    var ogPatterns = [
      {
        key: 'og:title',
        pattern: /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'og:description',
        pattern: /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'og:image',
        pattern: /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'og:url',
        pattern: /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'og:type',
        pattern: /<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
    ];

    ogPatterns.forEach(function ({ key, pattern }) {
      var match = html.match(pattern);
      if (match && match[1]) {
        metadata[key] = match[1];
      }
    });

    // Extract Twitter Card metadata
    var twitterPatterns = [
      {
        key: 'twitter:title',
        pattern: /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'twitter:description',
        pattern: /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'twitter:image',
        pattern: /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'twitter:card',
        pattern: /<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
    ];

    twitterPatterns.forEach(function ({ key, pattern }) {
      var match = html.match(pattern);
      if (match && match[1]) {
        metadata[key] = match[1];
      }
    });

    // Extract standard meta tags
    var standardPatterns = [
      {
        key: 'description',
        pattern: /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'keywords',
        pattern: /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
      {
        key: 'author',
        pattern: /<meta[^>]*name=["']author["'][^>]*content=["']([^"']*)["'][^>]*>/i,
      },
    ];

    standardPatterns.forEach(function ({ key, pattern }) {
      var match = html.match(pattern);
      if (match && match[1]) {
        metadata[key] = match[1];
      }
    });

    // Add page information
    metadata.url = sourceUrl;
    metadata.domain = this.extractDomain(sourceUrl);
    metadata.extractedAt = new Date().toISOString();
    metadata.extractionMethod = 'regex-based';

    return metadata;
  }

  /**
   * Extract images from HTML using regex patterns (safe extraction)
   */
  private extractImagesWithRegex(html: string, sourceUrl: string): string[] {
    try {
      var images: string[] = [];

      // Pattern to match img tags with src attributes
      var imgPattern = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
      var match;

      while ((match = imgPattern.exec(html)) !== null) {
        var src = match[1];

        // Skip data URLs and empty sources
        if (src && !src.startsWith('data:') && src.trim().length > 0) {
          try {
            // Convert relative URLs to absolute
            var absoluteUrl = new URL(src, sourceUrl).href;
            if (!images.includes(absoluteUrl)) {
              images.push(absoluteUrl);
            }
          } catch (error) {
            // Skip invalid URLs
            logger.debug('Skipping invalid image URL:', src);
          }
        }
      }

      logger.debug('Extracted images using regex:', {
        imageCount: images.length,
        sourceUrl,
      });

      return images;
    } catch (error) {
      logger.warn('Image extraction with regex failed:', error);
      return []; // Return empty array on failure - don't throw error
    }
  }

  async testGitHubConnection(): Promise<unknown> {
    try {
      var settings = await this.settingsManager.getSettings();

      if (!settings.githubToken || !settings.githubRepo) {
        return {
          success: false,
          status: 'failed',
          error: 'GitHub token and repository are required',
          timestamp: new Date().toISOString(),
        };
      }

      var result = await this.fileManager.testGitHubConnection(
        settings.githubToken,
        settings.githubRepo
      );

      return {
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('GitHub connection test failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // =================================================================
  // CONTENT EXTRACTION (from ContentExtractionManager)
  // =================================================================

  /**
   * Main content extraction method with automatic fallback strategy
   */
  async extractContent(tabId: number): Promise<IContentExtractionResult> {
    try {
      logger.info('Starting content extraction for tab:', tabId);

      // Validate tab first
      await this.validateTab(tabId);

      // Strategy 1: Try content script extraction (preferred)
      try {
        await this.ensureContentScriptInjected(tabId);
        await this.delay(ContentCaptureService.SCRIPT_INIT_DELAY);
        return await this.extractContentFromTab(tabId);
      } catch (error) {
        logger.warn('Content script extraction failed, falling back to direct extraction:', error);
      }

      // Strategy 2: Direct extraction fallback
      try {
        return await this.extractContentDirectly(tabId);
      } catch (error) {
        logger.warn('Direct extraction failed, using basic fallback:', error);
      }

      // Strategy 3: Basic fallback (last resort)
      return await this.extractBasicContent(tabId);
    } catch (error) {
      logger.error('All extraction strategies failed:', error);
      throw error;
    }
  }

  // =================================================================
  // DOCUMENT PROCESSING (from DocumentProcessor)
  // =================================================================

  /**
   * Process a document with content, metadata, and settings
   */
  processDocument(
    content: string,
    title: string,
    url: string,
    metadata: Record<string, unknown>,
    settings: Partial<ISettings>
  ): IProcessedDocument {
    logger.debug('Processing document:', {
      title,
      url,
      contentLength: content.length,
      hasSettings: !!settings,
    });

    // Create document metadata
    var docMetadata: IDocumentMetadata = {
      title,
      url,
      captureDate: new Date().toISOString(),
      tags: this.extractTagsFromMetadata(metadata),
      ...metadata,
    };

    // Generate filename
    var filename = this.generateFileName(
      title,
      url,
      ContentCaptureService.DEFAULT_FILENAME_PATTERN
    );

    // Determine folder
    var folder = this.determineFolder(docMetadata, settings);

    // Build full file path
    var filePath = this.buildFilePath(filename, folder);

    // Prepare final content with frontmatter
    var finalContent = this.prepareContent(content, docMetadata);

    logger.debug('Document processed:', {
      filename,
      folder,
      filePath,
      finalContentLength: finalContent.length,
    });

    return {
      filename,
      filePath,
      folder,
      content: finalContent,
      metadata: docMetadata,
    };
  }

  /**
   * Generate commit message for the document
   */
  generateCommitMessage(metadata: IDocumentMetadata, isUpdate: boolean = false): string {
    var action = isUpdate ? 'Update' : 'Add';
    var domain = this.extractDomain(metadata.url);
    return "" + (action) + " captured content: " + (metadata.title) + " (" + (domain) + ")";
  }

  // =================================================================
  // PRIVATE METHODS - Content Extraction
  // =================================================================

  private async validateTab(tabId: number): Promise<void> {
    var tab = await chrome.tabs.get(tabId);

    if (!tab.url || this.isSpecialPage(tab.url)) {
      throw new Error('Cannot extract content from special pages');
    }
  }

  private isSpecialPage(url: string): boolean {
    var specialPrefixes = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:',
      'file://',
    ];

    return specialPrefixes.some(function prefix { return url.startsWith(prefix); });
  }

  private async ensureContentScriptInjected(tabId: number): Promise<void> {
    logger.debug('Ensuring content script is injected in tab:', tabId);

    // Check if content script is already available
    if (await this.pingContentScript(tabId)) {
      logger.debug('Content script already active');
      return;
    }

    // Inject TurndownService library first
    await this.injectTurndownLibrary(tabId);

    // Inject content script
    await this.injectContentScript(tabId);
  }

  private async pingContentScript(tabId: number): Promise<boolean> {
    return new Promise<boolean>(function resolve {
      var timeout = setTimeout(() => resolve(false), ContentCaptureService.PING_TIMEOUT);

      chrome.tabs.sendMessage(tabId, { type: 'PING' }, response => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          logger.debug(
            'Ping failed (expected if script not injected):',
            chrome.runtime.lastError.message
          );
          resolve(false);
        } else {
          resolve(!!response);
        }
      });
    });
  }

  private async injectTurndownLibrary(tabId: number): Promise<void> {
    logger.debug('Injecting TurndownService library...');

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['libs/turndown.min.js'],
      });
      logger.debug('TurndownService library injected successfully');
    } catch (error) {
      logger.warn('Failed to inject TurndownService library:', error);
    }
  }

  private async injectContentScript(tabId: number): Promise<void> {
    logger.debug('Injecting content script...');

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content-script.js'],
      });
      logger.debug('Content script injected successfully');
    } catch (error) {
      logger.warn('Failed to inject content script:', error);
      throw new Error('Content script injection failed');
    }
  }

  private async extractContentFromTab(tabId: number): Promise<IContentExtractionResult> {
    return new Promise<IContentExtractionResult>(function (resolve, reject) {
      var timeout = setTimeout(() => {
        reject(new Error('Content extraction timeout after 10 seconds'));
      }, ContentCaptureService.CONTENT_SCRIPT_TIMEOUT);

      logger.debug('Sending EXTRACT_AND_CONVERT message to tab:', tabId);

      chrome.tabs.sendMessage(
        tabId,
        {
          type: 'EXTRACT_AND_CONVERT_TO_MARKDOWN',
          data: {
            extractionRules: ['article', 'main', '.content', '#content', 'body'],
            includeImages: true,
            cleanHtml: true,
            convertToMarkdown: true,
          },
        },
        (response: IContentExtractionResult) => {
          clearTimeout(timeout);

          logger.debug('Content script response received:', {
            response: response,
            hasResponse: !!response,
            success: response?.success,
            hasData: !!response?.data,
            dataKeys: response?.data ? Object.keys(response.data) : [],
            error: response?.error,
          });

          if (chrome.runtime.lastError) {
            logger.error('Content script message error:', chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else if (!response) {
            logger.error('No response received from content script');
            reject(new Error('No response received from content script'));
          } else if (!response.success) {
            logger.error('Content script reported failure:', response.error);
            reject(new Error(response.error || 'Content extraction failed'));
          } else {
            logger.debug('Content extraction and conversion successful via content script', {
              hasMarkdown: !!response.data?.markdown,
              markdownLength: response.data?.markdown?.length || 0,
              hasHtml: !!response.data?.html,
              htmlLength: response.data?.html?.length || 0,
            });
            resolve(response);
          }
        }
      );
    });
  }

  private async extractContentDirectly(tabId: number): Promise<IContentExtractionResult> {
    logger.debug('Extracting content directly from tab:', tabId);

    var results = await chrome.scripting.executeScript({
      target: { tabId },
      func: this.directExtractionScript,
    });

    if (!results || results.length === 0 || !results[0].result) {
      throw new Error('Failed to execute extraction script');
    }

    var extractedData = results[0].result;
    logger.debug('Direct extraction completed successfully');

    return {
      success: true,
      data: {
        html: extractedData.html,
        title: extractedData.title,
        url: extractedData.url,
        metadata: extractedData.metadata,
      },
      extractionMethod: 'direct',
      timestamp: new Date().toISOString(),
    };
  }

  private directExtractionScript = function () {
    var getPageTitle = (): string => {
      return document.title || 'Untitled';
    };

    var getPageUrl = (): string => {
      return window.location.href;
    };

    var extractMainContent = (): string => {
      var contentSelectors = [
        'article',
        '[role="article"]',
        'main',
        '[role="main"]',
        '.content',
        '#content',
        '.post-content',
        '.entry-content',
        '.article-content',
        '.page-content',
      ];

      var contentElement: Element | null = null;
      for (var selector of contentSelectors) {
        contentElement = document.querySelector(selector);
        if (
          contentElement &&
          contentElement.textContent &&
          contentElement.textContent.trim().length > 100
        ) {
          break;
        }
      }

      if (!contentElement) {
        contentElement = document.body;
      }

      return contentElement?.innerHTML || document.body.innerHTML;
    };

    var extractMetadata = (): Record<string, string> => {
      var metadata: Record<string, string> = {};

      var metaTags = document.querySelectorAll('meta');
      metaTags.forEach(meta => {
        var name = meta.getAttribute('name') || meta.getAttribute('property');
        var content = meta.getAttribute('content');
        if (name && content) {
          metadata[name] = content;
        }
      });

      return metadata;
    };

    return {
      title: getPageTitle(),
      url: getPageUrl(),
      html: extractMainContent(),
      metadata: extractMetadata(),
    };
  };

  private async extractBasicContent(tabId: number): Promise<IContentExtractionResult> {
    logger.warn('Using basic content extraction fallback');

    var tab = await chrome.tabs.get(tabId);
    var basicContent = "# " + (tab.title || 'Untitled') + "\n\nContent extraction failed. Only basic page information is available.\n\n**URL:** " + (tab.url || 'Unknown') + "\n**Captured:** " + (new Date().toISOString()) + "";

    return {
      success: true,
      data: {
        markdown: basicContent,
        frontmatter: this.generateBasicFrontmatter(tab.title, tab.url),
        html: "<h1>" + (tab.title || 'Untitled') + "</h1><p>Content extraction failed. Only basic page information is available.</p><p>URL: " + (tab.url || 'Unknown') + "</p>",
        title: tab.title || 'Untitled',
        url: tab.url || '',
        metadata: {
          extractedAt: new Date().toISOString(),
          method: 'basic-fallback',
          error: 'Content extraction failed',
        },
        images: [],
      },
      extractionMethod: 'basic-fallback',
      timestamp: new Date().toISOString(),
    };
  }

  // =================================================================
  // PRIVATE METHODS - Document Processing
  // =================================================================

  private generateFileName(
    title: string,
    url: string,
    pattern: string = ContentCaptureService.DEFAULT_FILENAME_PATTERN
  ): string {
    try {
      logger.debug('Generating filename:', { title, url, pattern });

      // Extract components
      var date = SharedUtils.formatDateForFilename();
      var domain = SharedUtils.sanitizeDomain(this.extractDomain(url));
      var sanitizedTitle = SharedUtils.sanitizeForFilename(title, 50);

      // Build filename using pattern
      var filename = pattern
        .replace(/YYYY-MM-DD/g, date)
        .replace(/domain/g, domain)
        .replace(/title/g, sanitizedTitle);

      // Sanitize the complete filename
      filename = SharedUtils.sanitizeForFilename(filename, 100);

      // Ensure .md extension
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }

      logger.debug('Generated filename:', filename);
      return filename;
    } catch (error) {
      logger.error('Error generating filename:', error);
      var fallback = "capture-" + (Date.now()) + ".md";
      logger.debug('Using fallback filename:', fallback);
      return fallback;
    }
  }

  private determineFolder(metadata: IDocumentMetadata, settings: Partial<ISettings>): string {
    logger.debug('Determining folder for document:', {
      title: metadata.title,
      url: metadata.url,
      tags: metadata.tags,
      defaultFolder: settings.defaultFolder,
    });

    // Use explicit folder setting if provided
    if (
      settings.defaultFolder &&
      settings.defaultFolder !== 'auto' &&
      settings.defaultFolder !== 'custom'
    ) {
      logger.debug('Using explicit folder setting:', settings.defaultFolder);
      return settings.defaultFolder;
    }

    // Use custom folder if specified
    if (settings.defaultFolder === 'custom' && settings.customFolder) {
      var sanitized = SharedUtils.sanitizeForFilename(settings.customFolder);
      logger.debug('Using custom folder:', sanitized);
      return sanitized;
    }

    // Auto-detect folder based on content
    var detected = this.autoDetectFolder(metadata);
    var final = detected || ContentCaptureService.DEFAULT_FOLDER;

    logger.debug('Auto-detected folder:', { detected, final });
    return final;
  }

  private autoDetectFolder(metadata: IDocumentMetadata): string | null {
    var searchText = [
      metadata.title.toLowerCase(),
      metadata.url.toLowerCase(),
      ...metadata.tags.map(function tag { return tag.toLowerCase(); }),
    ].join(' ');

    // Score each folder based on keyword matches
    var folderScores: Record<string, number> = {};

    Object.entries(ContentCaptureService.FOLDER_MAPPING).forEach(function ([folder, keywords]) {
      var score = 0;
      keywords.forEach(keyword => {
        var regex = new RegExp("\\b" + (keyword) + "\\b", 'gi');
        var matches = searchText.match(regex);
        if (matches) {
          score += matches.length;
        }
      });

      if (score > 0) {
        folderScores[folder] = score;
      }
    });

    // Return folder with highest score
    var bestFolder = Object.entries(folderScores).sort(function ([, a], [, b]) { return b - a; })[0];

    return bestFolder ? bestFolder[0] : null;
  }

  private buildFilePath(filename: string, folder: string): string {
    var documentPath = 'documents';
    var cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    var cleanFilename = filename.replace(/^\/+/, '');

    return "" + (documentPath) + "/" + (cleanFolder) + "/" + (cleanFilename) + "";
  }

  private prepareContent(content: string, metadata: IDocumentMetadata): string {
    var frontmatter = this.generateFrontmatter(metadata);
    return "" + (frontmatter) + "\n" + (content) + "";
  }

  private generateFrontmatter(metadata: IDocumentMetadata): string {
    var frontmatterData: Record<string, unknown> = {
      title: metadata.title,
      url: metadata.url,
      captured: metadata.captureDate,
      tags: metadata.tags,
    };

    // Add optional metadata fields
    if (metadata.author) {
      frontmatterData.author = metadata.author;
    }

    if (metadata.wordCount) {
      frontmatterData.wordCount = metadata.wordCount;
    }

    if (metadata.estimatedReadingTime) {
      frontmatterData.readingTime = "" + (metadata.estimatedReadingTime) + " min";
    }

    var frontmatter = '---\n';

    Object.entries(frontmatterData).forEach(function ([key, value]) {
      if (Array.isArray(value)) {
        frontmatter += "" + (key) + ":\n";
        value.forEach(item => {
          frontmatter += "  - " + (item) + "\n";
        });
      } else {
        frontmatter += "" + (key) + ": " + (SharedUtils.formatYamlValue(value)) + "\n";
      }
    });

    frontmatter += '---';
    return frontmatter;
  }

  private extractTagsFromMetadata(metadata: Record<string, unknown>): string[] {
    var tags: string[] = [];

    // Extract keywords from common metadata fields
    var keywordFields = ['keywords', 'description', 'author', 'category', 'tags'];

    keywordFields.forEach(function field {
      var value = metadata[field];
      if (typeof value === 'string') {
        // Split by common delimiters and clean up
        var extractedTags = value
          .split(/[,;|]/)
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 2 && tag.length < 30);
        tags.push(...extractedTags);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  private extractDomain(url: string): string {
    try {
      var urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return 'unknown';
    }
  }

  // =================================================================
  // PRIVATE METHODS - Capture Workflow
  // =================================================================

  private async validateAndGetSettings(shouldValidate: boolean): Promise<ISettings> {
    var settings = await this.settingsManager.getSettings();

    if (shouldValidate) {
      var validation = this.settingsManager.validateSettings(settings);
      if (!validation.isValid) {
        throw new Error("Invalid settings: " + (validation.errors.join(', ')) + "");
      }
    }

    return settings as ISettings;
  }

  private async getActiveTab(): Promise<chrome.tabs.Tab> {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tabs.length || !tabs[0].id) {
      throw new Error('No active tab found');
    }

    return tabs[0];
  }

  private async commitToGitHub(processedDoc: IProcessedDocument, settings: ISettings) {
    var githubSettings: IGitHubSettings = {
      token: settings.githubToken!,
      repository: settings.githubRepo!,
      branch: 'main',
    };

    return await this.fileManager.saveToGitHub(
      processedDoc.content,
      processedDoc.metadata,
      githubSettings
    );
  }

  private async storeLocally(processedDoc: IProcessedDocument): Promise<void> {
    var storageKey = "pending_capture_" + (Date.now()) + "";

    await chrome.storage.local.set({
      [storageKey]: {
        filePath: processedDoc.filePath,
        content: processedDoc.content,
        title: processedDoc.metadata.title,
        url: processedDoc.metadata.url,
        timestamp: new Date().toISOString(),
      },
    });

    logger.debug('Document stored locally with key:', storageKey);
  }

  private createSuccessResult(
    processedDoc: IProcessedDocument,
    options: {
      message: string;
      commitUrl?: string;
      status?: string;
      includeMarkdown?: boolean;
    }
  ): ICaptureResult {
    var result: ICaptureResult = {
      success: true,
      message: options.message,
      data: {
        filename: processedDoc.filename,
        filePath: processedDoc.filePath,
        title: processedDoc.metadata.title,
        url: processedDoc.metadata.url,
        markdownLength: processedDoc.content.length,
        timestamp: new Date().toISOString(),
      },
    };

    // Add optional fields
    if (options.commitUrl) {
      result.data!.commitUrl = options.commitUrl;
    }

    if (options.status) {
      result.data!.status = options.status;
    }

    if (options.includeMarkdown) {
      result.data!.markdown = processedDoc.content;
    }

    return result;
  }

  private generateBasicFrontmatter(title?: string, url?: string): string {
    return [
      '---',
      'title: "' + ((title || 'Untitled').replace(/"/g, '\\"')) + '"',
      'url: "' + (url || '') + '"',
      'capture_date: "' + (new Date().toISOString()) + '"',
      'source: "PrismWeave Browser Extension"',
      'tags: ["web-capture", "fallback"]',
      '---',
      '',
    ].join('\n');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(function resolve { return setTimeout(resolve, ms); });
  }
}
