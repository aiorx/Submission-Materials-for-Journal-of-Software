// Aided with basic GitHub coding tools
// Injectable Markdown Converter for PrismWeave Bookmarklet
// This module creates an injectable version of the sophisticated browser extension MarkdownConverter
// that can be loaded dynamically into web pages via script injection

var createLogger = require('../utils/logger.js').createLogger;
var MarkdownConverter = require('../utils/markdown-converter.js').MarkdownConverter;

// Re-export types for standalone use
export interface IInjectableMarkdownOptions {
  preserveFormatting?: boolean;
  includeMetadata?: boolean;
  generateFrontmatter?: boolean;
  includeImages?: boolean;
  includeLinks?: boolean;
  customRules?: Array<{ filter: string; replacement: string | Function }>;
}

export interface IInjectableMarkdownResult {
  markdown: string;
  frontmatter: string;
  metadata: Record<string, unknown>;
  warnings: string[];
  wordCount: number;
  readingTime: number;
  conversionMethod: 'injectable-advanced';
}

/**
 * Injectable Markdown Converter
 * Uses the sophisticated browser extension MarkdownConverter in an injectable context
 */
class InjectableMarkdownConverter {
  private _converter: MarkdownConverter | null = null;
  private _logger: any;
  private _isInitialized: boolean = false;

  constructor() {
    // Create a simple logger for injectable context
    this._logger = createLogger('InjectableMarkdownConverter');
  }

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    try {
      // Initialize the sophisticated MarkdownConverter
      this._converter = new MarkdownConverter();
      this._isInitialized = true;
      this._logger.info('Injectable markdown converter initialized');
    } catch (error) {
      this._logger.error('Failed to initialize injectable markdown converter:', error);
      throw error;
    }
  }

  async convertToAdvancedMarkdown(
    html: string,
    options: IInjectableMarkdownOptions = {}
  ): Promise<IInjectableMarkdownResult> {
    if (!this._isInitialized || !this._converter) {
      await this.initialize();
    }

    try {
      this._logger.info('Starting advanced HTML to Markdown conversion');

      // Use the sophisticated browser extension markdown converter
      var conversionResult = await this._converter!.convertToMarkdown(html);

      // Generate frontmatter if requested
      var frontmatter = options.generateFrontmatter ? this._generateFrontmatter() : '';

      // Extract metadata if requested
      var metadata = options.includeMetadata ? this._extractMetadata() : {};

      // Calculate metrics from the conversion result
      var wordCount = this._countWords(conversionResult.markdown);
      var readingTime = Math.ceil(wordCount / 200);

      // Apply custom post-processing if needed
      var processedMarkdown = conversionResult.markdown;
      if (!options.includeImages) {
        processedMarkdown = this._removeImages(processedMarkdown);
      }
      if (!options.includeLinks) {
        processedMarkdown = this._removeLinks(processedMarkdown);
      }

      return {
        markdown: processedMarkdown,
        frontmatter,
        metadata: {
          ...conversionResult.metadata,
          ...metadata,
          wordCount,
          readingTime,
          conversionMethod: 'injectable-advanced',
          convertedAt: new Date().toISOString(),
        },
        warnings: [], // The MarkdownConverter handles warnings internally
        wordCount,
        readingTime,
        conversionMethod: 'injectable-advanced',
      };
    } catch (error) {
      this._logger.error('Advanced markdown conversion failed:', error);
      var errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error("Advanced markdown conversion failed: " + (errorMessage) + "");
    }
  }

  private _generateFrontmatter(): string {
    var title = this._extractTitle();
    var url = window.location.href;
    var now = new Date();
    var dateStr = now.toISOString().split('T')[0];

    return '---
title: "' + (title.replace(/"/g, '\\"')) + '"
url: "' + (url) + '"
date: "' + (dateStr) + '"
captured: "' + (now.toISOString()) + '"
tags: []
---';
  }

  private _extractMetadata(): Record<string, unknown> {
    var metadata: Record<string, unknown> = {};

    // Open Graph metadata
    document.querySelectorAll('[property^="og:"]').forEach(function meta {
      var property = meta.getAttribute('property');
      var content = meta.getAttribute('content');
      if (property && content) {
        metadata[property] = content;
      }
    });

    // Twitter Card metadata
    document.querySelectorAll('[name^="twitter:"]').forEach(function meta {
      var name = meta.getAttribute('name');
      var content = meta.getAttribute('content');
      if (name && content) {
        metadata[name] = content;
      }
    });

    // Standard meta tags
    var metaTags = ['description', 'keywords', 'author'];
    metaTags.forEach(function name {
      var meta = document.querySelector('[name="' + (name) + '"]');
      if (meta) {
        var content = meta.getAttribute('content');
        if (content) metadata[name] = content;
      }
    });

    // Page information
    metadata.url = window.location.href;
    metadata.domain = window.location.hostname;
    metadata.convertedAt = new Date().toISOString();

    return metadata;
  }

  private _extractTitle(): string {
    // Enhanced title extraction with multiple fallbacks
    var titleSources = [
      function () { return document.querySelector('[property="og:title"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="twitter:title"]')?.getAttribute('content'); },
      function () { return document.querySelector('h1')?.textContent; },
      function () { return document.title; },
    ];

    for (var source of titleSources) {
      try {
        var title = source();
        if (title && title.trim().length > 0) {
          return title.trim();
        }
      } catch (error) {
        // Source failed, try next
      }
    }

    return 'Untitled Page';
  }

  private _countWords(text: string): number {
    if (!text) return 0;
    return text.split(/\s+/).filter(function word { return word.length > 0; }).length;
  }

  private _removeImages(markdown: string): string {
    // Remove markdown images: ![alt](src)
    return markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  }

  private _removeLinks(markdown: string): string {
    // Convert markdown links to plain text: [text](url) -> text
    return markdown.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  }

  // Static method for easy access
  static async convertHtml(
    html: string,
    options: IInjectableMarkdownOptions = {}
  ): Promise<IInjectableMarkdownResult> {
    var converter = new InjectableMarkdownConverter();
    return await converter.convertToAdvancedMarkdown(html, options);
  }

  // Utility method to convert extracted content to full markdown document
  static async createMarkdownDocument(
    title: string,
    content: string,
    options: IInjectableMarkdownOptions = { generateFrontmatter: true }
  ): Promise<string> {
    var result = await InjectableMarkdownConverter.convertHtml(content, options);

    if (options.generateFrontmatter && result.frontmatter) {
      return "" + (result.frontmatter) + "\n\n" + (result.markdown) + "";
    }

    return result.markdown;
  }
}

// Global registration for bookmarklet access
declare global {
  interface Window {
    PrismWeaveInjectableMarkdownConverter?: typeof InjectableMarkdownConverter;
    prismweaveConvertToMarkdown?: function (
      html: string,
      options?: IInjectableMarkdownOptions
    ) { return Promise<IInjectableMarkdownResult>; };
    prismweaveCreateMarkdownDocument?: function (
      title: string,
      content: string,
      options?: IInjectableMarkdownOptions
    ) { return Promise<string>; };
  }
}

// Register globally for bookmarklet access
if (typeof window !== 'undefined') {
  window.PrismWeaveInjectableMarkdownConverter = InjectableMarkdownConverter;
  window.prismweaveConvertToMarkdown = InjectableMarkdownConverter.convertHtml;
  window.prismweaveCreateMarkdownDocument = InjectableMarkdownConverter.createMarkdownDocument;

  // Log successful injection
  console.log('🔗 PrismWeave Injectable Markdown Converter loaded successfully');
}
