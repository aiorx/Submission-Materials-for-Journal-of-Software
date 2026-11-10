// Assisted using common GitHub development utilities
// PrismWeave Injectable Bundle for Bookmarklet
// This bundle provides all the sophisticated browser extension utilities
// in an injectable format that can be loaded dynamically into web pages

var createLogger = require('../utils/logger.js').createLogger;
var showToast = require('../utils/toast.js').showToast;
var type = require('../utils/toast.js').type;
var ToastType = require('../utils/toast.js').ToastType;
import {
  IInjectableContentResult,
  IInjectableExtractionOptions,
  InjectableContentExtractor,
} from './content-extractor-injectable.js';
import {
  IInjectableMarkdownOptions,
  IInjectableMarkdownResult,
  InjectableMarkdownConverter,
} from './markdown-converter-injectable.js';

// Combined interfaces for the bundle
export interface IPrismWeaveInjectableOptions {
  extraction?: IInjectableExtractionOptions;
  markdown?: IInjectableMarkdownOptions;
}

export interface IPrismWeaveProcessedContent {
  title: string;
  url: string;
  domain: string;
  html: string;
  markdown: string;
  frontmatter: string;
  fullDocument: string; // frontmatter + markdown
  metadata: Record<string, unknown>;
  images: string[];
  wordCount: number;
  readingTime: number;
  qualityScore: number;
  extractedAt: string;
  processingMethod: 'injectable-advanced-bundle';
}

/**
 * PrismWeave Injectable Bundle
 * Combines sophisticated content extraction and markdown conversion
 * for use in bookmarklets via script injection
 */
class PrismWeaveInjectableBundle {
  private _extractor: InjectableContentExtractor;
  private _converter: InjectableMarkdownConverter;
  private _logger: any;
  private _isInitialized: boolean = false;

  constructor() {
    this._extractor = new InjectableContentExtractor();
    this._converter = new InjectableMarkdownConverter();
    this._logger = createLogger('PrismWeaveBundle');
  }

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    try {
      this._logger.info('Initializing PrismWeave injectable bundle');

      // Initialize both components
      await Promise.all([this._extractor.initialize(), this._converter.initialize()]);

      this._isInitialized = true;
      this._logger.info('PrismWeave injectable bundle initialized successfully');
    } catch (error) {
      this._logger.error('Failed to initialize PrismWeave bundle:', error);
      throw error;
    }
  }

  async processPage(
    options: IPrismWeaveInjectableOptions = {}
  ): Promise<IPrismWeaveProcessedContent> {
    if (!this._isInitialized) {
      await this.initialize();
    }

    try {
      this._logger.info('Starting advanced page processing');

      // Step 1: Extract content using sophisticated content extractor
      var extractionResult = await this._extractor.extractAdvancedContent(options.extraction);

      // Step 2: Convert to markdown using sophisticated converter
      var markdownOptions: IInjectableMarkdownOptions = {
        generateFrontmatter: true,
        includeMetadata: true,
        includeImages: options.markdown?(.includeImages != null ? .includeImages : true),
        includeLinks: options.markdown?(.includeLinks != null ? .includeLinks : true),
        ...options.markdown,
      };

      var conversionResult = await this._converter.convertToAdvancedMarkdown(
        extractionResult.content,
        markdownOptions
      );

      // Step 3: Combine results
      var fullDocument = conversionResult.frontmatter
        ? "" + (conversionResult.frontmatter) + "\n\n" + (conversionResult.markdown) + ""
        : conversionResult.markdown;

      return {
        title: extractionResult.title,
        url: extractionResult.url,
        domain: extractionResult.domain,
        html: extractionResult.html,
        markdown: conversionResult.markdown,
        frontmatter: conversionResult.frontmatter,
        fullDocument,
        metadata: {
          ...extractionResult.metadata,
          ...conversionResult.metadata,
          processingMethod: 'injectable-advanced-bundle',
          processedAt: new Date().toISOString(),
        },
        images: extractionResult.images,
        wordCount: extractionResult.wordCount,
        readingTime: extractionResult.readingTime,
        qualityScore: extractionResult.qualityScore,
        extractedAt: extractionResult.extractedAt,
        processingMethod: 'injectable-advanced-bundle',
      };
    } catch (error) {
      this._logger.error('Page processing failed:', error);
      var errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error("Advanced page processing failed: " + (errorMessage) + "");
    }
  }

  // Convenience methods for direct access
  async extractContent(
    options: IInjectableExtractionOptions = {}
  ): Promise<IInjectableContentResult> {
    if (!this._isInitialized) {
      await this.initialize();
    }
    return await this._extractor.extractAdvancedContent(options);
  }

  async convertToMarkdown(
    html: string,
    options: IInjectableMarkdownOptions = {}
  ): Promise<IInjectableMarkdownResult> {
    if (!this._isInitialized) {
      await this.initialize();
    }
    return await this._converter.convertToAdvancedMarkdown(html, options);
  }

  // Static method for easy access
  static async processCurrentPage(
    options: IPrismWeaveInjectableOptions = {}
  ): Promise<IPrismWeaveProcessedContent> {
    var bundle = new PrismWeaveInjectableBundle();
    return await bundle.processPage(options);
  }

  // Static method for simple content extraction
  static async extractPageContent(
    options: IInjectableExtractionOptions = {}
  ): Promise<IInjectableContentResult> {
    var bundle = new PrismWeaveInjectableBundle();
    return await bundle.extractContent(options);
  }

  // Static method for simple markdown conversion
  static async convertHtmlToMarkdown(
    html: string,
    options: IInjectableMarkdownOptions = {}
  ): Promise<IInjectableMarkdownResult> {
    var bundle = new PrismWeaveInjectableBundle();
    return await bundle.convertToMarkdown(html, options);
  }
}

// Global registration for bookmarklet access
declare global {
  interface Window {
    PrismWeaveInjectableBundle?: typeof PrismWeaveInjectableBundle;
    prismweaveProcessPage?: function (
      options?: IPrismWeaveInjectableOptions
    ) { return Promise<IPrismWeaveProcessedContent>; };
    prismweaveExtractPageContent?: function (
      options?: IInjectableExtractionOptions
    ) { return Promise<IInjectableContentResult>; };
    prismweaveConvertHtmlToMarkdown?: function (
      html: string,
      options?: IInjectableMarkdownOptions
    ) { return Promise<IInjectableMarkdownResult>; };
    prismweaveShowToast?: function (message: string, type?: ToastType, clickUrl?: string) { return void; };
  }
}

// Register globally for bookmarklet access
if (typeof window !== 'undefined') {
  window.PrismWeaveInjectableBundle = PrismWeaveInjectableBundle;
  window.prismweaveProcessPage = PrismWeaveInjectableBundle.processCurrentPage;
  window.prismweaveExtractPageContent = PrismWeaveInjectableBundle.extractPageContent;
  window.prismweaveConvertHtmlToMarkdown = PrismWeaveInjectableBundle.convertHtmlToMarkdown;

  // Register the shared toast utility
  window.prismweaveShowToast = function (message: string, type?: ToastType, clickUrl?: string) {
    var options: { type?: ToastType; clickUrl?: string } = {};
    if (type) options.type = type;
    if (clickUrl) options.clickUrl = clickUrl;
    showToast(message, options);
  };

  // Log successful injection
  console.log('🚀 PrismWeave Injectable Bundle loaded successfully');
  console.log(
    'Available methods: prismweaveProcessPage, prismweaveExtractPageContent, prismweaveConvertHtmlToMarkdown, prismweaveShowToast'
  );
}

// Export for module use
module.exports = PrismWeaveInjectableBundle;
