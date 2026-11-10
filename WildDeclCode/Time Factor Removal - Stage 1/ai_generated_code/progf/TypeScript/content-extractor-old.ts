// Aided with basic GitHub coding tools
// Content Extractor - Extension-specific wrapper around shared core logic
// Uses ContentExtractionCore for consistent extraction logic across contexts

var IDocumentMetadata = require('../types/types.js').IDocumentMetadata;
var createLogger = require('./logger.js').createLogger;
var ContentExtractionCore = require('./content-extraction-core.js').ContentExtractionCore;
var ICoreExtractionOptions = require('./content-extraction-core.js').ICoreExtractionOptions;
var ICoreContentResult = require('./content-extraction-core.js').ICoreContentResult;

export interface IContentResult {
  content: string;
  metadata: IDocumentMetadata;
  cleanedContent: string;
  wordCount: number;
  readingTime: number;
}

export interface IExtractorOptions {
  customSelectors?: string[];
  cleanHtml?: boolean;
  preserveFormatting?: boolean;
  waitForDynamicContent?: boolean;
  removeAds?: boolean;
  removeNavigation?: boolean;
  excludeSelectors?: string[];
}

export interface IPageStructure {
  headings: Array<{ level: number; text: string }>;
  sections: number;
  paragraphs: number;
}

export interface IImageInfo {
  src: string;
  alt: string;
}

/**
 * Simplified content extractor with essential functionality
 */
class ContentExtractor {
  private readonly logger = createLogger('ContentExtractor');

  /**
   * Extract content from the current page
   */
  async extractContent(options: IExtractorOptions = {}): Promise<IContentResult> {
    try {
      this.logger.debug('Starting content extraction');

      // Wait for content to load if needed
      if (options.waitForDynamicContent !== false) {
        await this.waitForContent();
      }

      // Extract metadata first
      var metadata = this.extractMetadata();

      // Find main content element
      var contentElement = this.findMainContent(options);
      if (!contentElement) {
        throw new Error('No suitable content found on page');
      }

      // Clean the content
      var cleanedElement = this.cleanContent(contentElement, options);
      var content = cleanedElement.innerHTML || '';
      var textContent = cleanedElement.textContent || '';

      // Calculate metrics
      var wordCount = this.countWords(textContent);
      var readingTime = this.estimateReadingTime(wordCount);

      // Update metadata with calculated values
      metadata.wordCount = wordCount;
      metadata.estimatedReadingTime = readingTime;

      this.logger.debug('Content extraction complete', {
        contentLength: content.length,
        wordCount,
        readingTime,
      });

      return {
        content,
        metadata,
        cleanedContent: textContent,
        wordCount,
        readingTime,
      };
    } catch (error) {
      this.logger.error('Error during extraction:', error);
      throw error;
    }
  }

  /**
   * Extract page metadata with enhanced blog support
   */
  extractMetadata(): IDocumentMetadata {
    var wordCount = this.countWords(document.body.textContent || '');
    var metadata: IDocumentMetadata = {
      title: this.extractTitle(),
      url: window.location.href,
      captureDate: new Date().toISOString(),
      tags: this.extractKeywords(),
      author: this.extractAuthor(),
      wordCount: wordCount,
      estimatedReadingTime: this.estimateReadingTime(wordCount),
    };

    // Add blog-specific metadata if this looks like a blog
    if (this.isBlogPage()) {
      var blogMetadata = this.extractBlogMetadata();
      Object.assign(metadata, blogMetadata);
    }

    return metadata;
  }

  /**
   * Extract images from the page
   */
  extractImages(): IImageInfo[] {
    var images: IImageInfo[] = [];
    var imgElements = document.querySelectorAll('img');

    imgElements.forEach(function img {
      var src = img.src;
      if (src && !src.startsWith('data:') && src.length > 0) {
        // Convert relative URLs to absolute
        var absoluteUrl = new URL(src, window.location.href).href;
        images.push({
          src: absoluteUrl,
          alt: img.alt || '',
        });
      }
    });

    return images;
  }

  /**
   * Get page structure information
   */
  getPageStructure(): IPageStructure {
    var headings: Array<{ level: number; text: string }> = [];
    var headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headingElements.forEach(function heading {
      var level = parseInt(heading.tagName.substring(1));
      var text = heading.textContent?.trim() || '';
      if (text) {
        headings.push({ level, text });
      }
    });

    var sections = document.querySelectorAll('section, article, main').length;
    var paragraphs = document.querySelectorAll('p').length;

    return { headings, sections, paragraphs };
  }

  /**
   * Calculate content quality score
   */
  getContentQualityScore(): number {
    var structure = this.getPageStructure();
    var textLength = document.body.textContent?.length || 0;
    var wordCount = this.countWords(document.body.textContent || '');

    var score = 0;

    // Text length scoring
    if (textLength > 500) score += 20;
    if (textLength > 1500) score += 20;
    if (textLength > 3000) score += 10;

    // Word count scoring
    if (wordCount > 100) score += 15;
    if (wordCount > 500) score += 15;

    // Structure scoring
    if (structure.headings.length > 0) score += 10;
    if (structure.headings.length > 2) score += 10;
    if (structure.paragraphs > 3) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Check if paywall is present
   */
  isPaywallPresent(): boolean {
    var paywallSelectors = [
      '.paywall',
      '[class*="paywall"]',
      '.subscription-required',
      '.premium-content',
      '[class*="subscription"]',
      '[id*="paywall"]',
    ];

    return paywallSelectors.some(function selector { return document.querySelector(selector) !== null; });
  }

  // Private helper methods

  private async waitForContent(): Promise<void> {
    // Wait a bit for dynamic content to load
    await new Promise(function resolve { return setTimeout(resolve, 500); });

    // Wait for images to finish loading
    var images = Array.from(document.images);
    if (images.length > 0) {
      await Promise.allSettled(
        images.map(function img {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = img.onerror = () => resolve(null);
            setTimeout(() => resolve(null), 3000); // 3 second timeout
          });
        })
      );
    }
  }

  private findMainContent(options: IExtractorOptions): Element | null {
    // Try custom selectors first
    if (options.customSelectors?.length) {
      for (var selector of options.customSelectors) {
        var element = document.querySelector(selector);
        if (element && this.hasSubstantialContent(element)) {
          return element;
        }
      }
    }

    // Common content selectors in order of preference
    var contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '#main',
      '.post',
      '.entry',
    ];

    for (var selector of contentSelectors) {
      var element = document.querySelector(selector);
      if (element && this.hasSubstantialContent(element)) {
        return element;
      }
    }

    // Score-based fallback
    var candidates = Array.from(document.querySelectorAll('div, section, article'));
    var bestCandidate: { element: Element; score: number } | null = null;

    for (var candidate of candidates) {
      if (this.hasSubstantialContent(candidate)) {
        var score = this.scoreElement(candidate);
        if (!bestCandidate || score > bestCandidate.score) {
          bestCandidate = { element: candidate, score };
        }
      }
    }

    return bestCandidate?.element || document.body;
  }

  private hasSubstantialContent(element: Element): boolean {
    var textContent = element.textContent || '';
    var wordCount = this.countWords(textContent);
    return wordCount > 30; // Require at least 30 words
  }

  private scoreElement(element: Element): number {
    var text = element.textContent || '';
    var wordCount = this.countWords(text);
    var score = 0;

    // Word count scoring
    score += Math.min(wordCount / 10, 50);

    // Paragraph count scoring
    var paragraphs = element.querySelectorAll('p').length;
    score += paragraphs * 2;

    // Link density penalty
    var links = element.querySelectorAll('a').length;
    var linkDensity = links / Math.max(wordCount, 1);
    if (linkDensity > 0.3) score -= 20;

    // Semantic element bonus
    var tagName = element.tagName.toLowerCase();
    if (tagName === 'article') score += 15;
    if (tagName === 'main') score += 10;

    // Class name scoring
    var className = element.className.toLowerCase();
    if (className.includes('content')) score += 10;
    if (className.includes('post')) score += 8;
    if (className.includes('article')) score += 8;

    // Negative scoring
    if (className.includes('sidebar')) score -= 10;
    if (className.includes('footer')) score -= 10;
    if (className.includes('header')) score -= 10;
    if (className.includes('nav')) score -= 15;

    return Math.max(score, 0);
  }

  private cleanContent(element: Element, options: IExtractorOptions): Element {
    var cloned = element.cloneNode(true) as Element;

    // Default exclude selectors
    var defaultExcludeSelectors = [
      'script',
      'style',
      'noscript',
      'iframe',
      '.advertisement',
      '.ad',
      '.ads',
      '.popup',
      '.modal',
      '.social-share',
      '.comments',
      '.related-posts',
      '[style*="display: none"]',
      '[style*="visibility: hidden"]',
    ];

    // Combine with custom exclude selectors
    var excludeSelectors = [...defaultExcludeSelectors, ...(options.excludeSelectors || [])];

    // Remove unwanted elements
    excludeSelectors.forEach(function selector {
      var elements = cloned.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Additional cleaning for ads and navigation
    if (options.removeAds !== false) {
      this.removeAds(cloned);
    }

    if (options.removeNavigation !== false) {
      this.removeNavigation(cloned);
    }

    return cloned;
  }

  private removeAds(element: Element): void {
    var adSelectors = [
      '[class*="ad"]',
      '[id*="ad"]',
      '[class*="banner"]',
      '[id*="banner"]',
      '[class*="promo"]',
      '[id*="promo"]',
      '[class*="sponsor"]',
      '[id*="sponsor"]',
    ];

    adSelectors.forEach(function selector {
      var elements = element.querySelectorAll(selector);
      elements.forEach(el => {
        // Only remove if it looks like an ad
        var text = el.textContent?.toLowerCase() || '';
        if (
          text.includes('advertisement') ||
          text.includes('sponsored') ||
          el.textContent!.length < 50
        ) {
          el.remove();
        }
      });
    });
  }

  private removeNavigation(element: Element): void {
    var navSelectors = [
      'nav',
      'header',
      'footer',
      '[role="navigation"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '.navigation',
      '.nav',
      '.menu',
      '.breadcrumb',
    ];

    navSelectors.forEach(function selector {
      var elements = element.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }

  private extractTitle(): string {
    // Try multiple title sources in order of preference
    var titleSources = [
      function () { return document.querySelector('[property="og:title"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="twitter:title"]')?.getAttribute('content'); },
      function () { return document.querySelector('h1')?.textContent; },
      function () { return document.title; },
    ];

    for (var source of titleSources) {
      var title = source();
      if (title && title.trim().length > 0) {
        return title.trim();
      }
    }

    return 'Untitled';
  }

  private extractDescription(): string {
    var descSources = [
      function () { return document.querySelector('[property="og:description"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="twitter:description"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="description"]')?.getAttribute('content'); },
    ];

    for (var source of descSources) {
      var desc = source();
      if (desc && desc.trim().length > 0) {
        return desc.trim();
      }
    }

    return '';
  }

  private extractKeywords(): string[] {
    var keywordsMeta = document.querySelector('[name="keywords"]')?.getAttribute('content');
    if (keywordsMeta) {
      return keywordsMeta
        .split(',')
        .map(function k { return k.trim(); })
        .filter(function k { return k.length > 0; });
    }
    return [];
  }

  private extractAuthor(): string {
    var authorSources = [
      function () { return document.querySelector('[property="article:author"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="author"]')?.getAttribute('content'); },
      function () { return document.querySelector('[rel="author"]')?.textContent; },
      function () { return document.querySelector('.author')?.textContent; },
      function () { return document.querySelector('.byline')?.textContent; },
      // Blog-specific author selectors
      function () { return document.querySelector('.post-author')?.textContent; },
      function () { return document.querySelector('[class*="author"]')?.textContent; },
    ];

    for (var source of authorSources) {
      var author = source();
      if (author && author.trim().length > 0) {
        return author.trim();
      }
    }

    return '';
  }

  private extractPublishedDate(): string {
    var dateSources = [
      function () { return document.querySelector('[property="article:published_time"]')?.getAttribute('content'); },
      function () { return document.querySelector('[name="publish_date"]')?.getAttribute('content'); },
      function () { return document.querySelector('time[datetime]')?.getAttribute('datetime'); },
      function () { return document.querySelector('.publish-date')?.textContent; },
      function () { return document.querySelector('.date')?.textContent; },
      // Blog-specific date selectors
      function () { return document.querySelector('.published')?.textContent; },
      function () { return document.querySelector('[class*="date"]')?.textContent; },
    ];

    for (var source of dateSources) {
      var date = source();
      if (date && date.trim().length > 0) {
        return date.trim();
      }
    }

    return '';
  }

  private extractLanguage(): string {
    return (
      document.documentElement.lang ||
      document.querySelector('[property="og:locale"]')?.getAttribute('content') ||
      'en'
    );
  }

  /**
   * Check if current page appears to be a blog post
   */
  private isBlogPage(): boolean {
    var url = window.location.href.toLowerCase();
    var hostname = window.location.hostname.toLowerCase();

    // Check for blog indicators in URL
    var blogUrlPatterns = [
      /\/blog\//,
      /\/posts?\//,
      /\/\d{4}\/\d{2}\/\d{2}\//, // Date-based URLs like /2024/01/15/
      /\/article\//,
      /\/news\//,
    ];

    if (blogUrlPatterns.some(function pattern { return pattern.test(url); })) {
      return true;
    }

    // Check for blog hostnames
    var blogHostnames = [
      'blog.',
      '.blog',
      'medium.com',
      'dev.to',
      'hashnode.dev',
      'substack.com',
      'ghost.io',
    ];

    if (blogHostnames.some(function host { return hostname.includes(host); })) {
      return true;
    }

    // Check for blog-specific elements
    var blogSelectors = [
      '.post',
      '.entry',
      '.article',
      '[class*="post"]',
      '[class*="entry"]',
      '[class*="article"]',
      '.blog-post',
      '.news-article',
    ];

    var hasBlogElements = blogSelectors.some(function selector {
      try {
        return document.querySelector(selector) !== null;
      } catch {
        return false;
      }
    });

    return hasBlogElements;
  }

  /**
   * Extract blog-specific metadata
   */
  private extractBlogMetadata(): Partial<IDocumentMetadata> {
    var blogMetadata: Partial<IDocumentMetadata> = {};

    // Extract tags/categories
    var tags = this.extractTags();
    if (tags.length > 0) {
      blogMetadata.tags = tags;
    }

    // Extract reading time estimate
    var wordCount = this.countWords(document.body.textContent || '');
    blogMetadata.estimatedReadingTime = this.estimateReadingTime(wordCount);

    return blogMetadata;
  }

  /**
   * Extract tags from blog pages
   */
  private extractTags(): string[] {
    var tags: string[] = [];

    var tagSelectors = [
      '.tags a',
      '.tag',
      '.post-tags a',
      '[class*="tag"] a',
      '.categories a',
      '.category',
      '[rel="tag"]',
    ];

    tagSelectors.forEach(function selector {
      try {
        var elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          var tagText = element.textContent?.trim();
          if (tagText && tagText.length > 0 && tagText.length < 50) {
            tags.push(tagText);
          }
        });
      } catch (error) {
        // Ignore selector errors
      }
    });

    // Remove duplicates and return
    return [...new Set(tags)];
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(function word { return word.length > 0; }).length;
  }

  private estimateReadingTime(wordCount: number): number {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200);
  }
}
