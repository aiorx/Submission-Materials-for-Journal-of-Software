// Aided with basic GitHub coding tools
// Content Extraction Core - Chrome-API-free extraction logic
// Shared utility that works in both browser extension and injectable contexts
// Contains all core content extraction logic without any Chrome API dependencies

var IDocumentMetadata = require('../types/types.js').IDocumentMetadata;
var createLogger = require('./logger.js').createLogger;

export interface ICoreExtractionOptions {
  customSelectors?: string[];
  cleanHtml?: boolean;
  preserveFormatting?: boolean;
  waitForDynamicContent?: boolean;
  removeAds?: boolean;
  removeNavigation?: boolean;
  excludeSelectors?: string[];
  includeImages?: boolean;
  includeLinks?: boolean;
  maxWordCount?: number;
}

export interface ICoreContentResult {
  content: string;
  metadata: IDocumentMetadata;
  cleanedContent: string;
  wordCount: number;
  readingTime: number;
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
 * Core content extraction utility without Chrome API dependencies
 * Can be used in both browser extension and injectable contexts
 */
class ContentExtractionCore {
  private readonly logger = createLogger('ContentExtractionCore');

  /**
   * Extract content from the current page
   */
  async extractContent(options: ICoreExtractionOptions = {}): Promise<ICoreContentResult> {
    try {
      this.logger.debug('Starting core content extraction');

      // Wait for content to load if needed
      if (options.waitForDynamicContent !== false) {
        await this.waitForContent();
      }

      // Extract metadata first
      var metadata = this.extractMetadata();

      // Find and extract main content
      var mainContent = this.findMainContent(options);
      if (!mainContent) {
        throw new Error('No suitable content found on page');
      }

      // Clean the content
      var cleanedElement = this.cleanContent(mainContent, options);
      var content = cleanedElement.innerHTML;
      var cleanedContent = cleanedElement.textContent || '';

      // Calculate metrics
      var wordCount = this.countWords(cleanedContent);
      var readingTime = this.estimateReadingTime(wordCount);

      this.logger.debug('Content extraction completed', {
        wordCount,
        readingTime,
        contentLength: content.length,
      });

      return {
        content,
        metadata: {
          ...metadata,
          wordCount,
          estimatedReadingTime: readingTime,
        },
        cleanedContent,
        wordCount,
        readingTime,
      };
    } catch (error) {
      this.logger.error('Content extraction failed:', error);
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
      var src = img.src || img.dataset.src; // Handle lazy-loaded images
      var alt = img.alt || '';

      if (src && !src.startsWith('data:') && src.length > 0) {
        // Convert relative URLs to absolute
        try {
          var absoluteUrl = new URL(src, window.location.href).href;
          images.push({ src: absoluteUrl, alt });
        } catch (error) {
          // Skip invalid URLs
        }
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
      var level = parseInt(heading.tagName.charAt(1));
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

    // Content density (text to HTML ratio)
    var htmlLength = document.body.innerHTML?.length || 1;
    var density = textLength / htmlLength;
    score += density * 10;

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

  /**
   * Extract advanced metadata including structured data
   */
  extractAdvancedMetadata(): Record<string, unknown> {
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
    var metaTags = ['description', 'keywords', 'author', 'generator', 'theme-color'];
    metaTags.forEach(function name {
      var meta = document.querySelector('[name="' + (name) + '"]');
      if (meta) {
        var content = meta.getAttribute('content');
        if (content) metadata[name] = content;
      }
    });

    // Structured data (JSON-LD)
    try {
      var jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      var structuredData: any[] = [];
      jsonLdScripts.forEach(function script {
        try {
          var data = JSON.parse(script.textContent || '');
          structuredData.push(data);
        } catch (error) {
          // Skip invalid JSON-LD
        }
      });
      if (structuredData.length > 0) {
        metadata.structuredData = structuredData;
      }
    } catch (error) {
      // JSON-LD parsing failed, continue without it
    }

    // Page information
    metadata.url = window.location.href;
    metadata.domain = window.location.hostname;
    metadata.pathname = window.location.pathname;
    metadata.language = document.documentElement.lang || 'en';
    metadata.extractedAt = new Date().toISOString();

    return metadata;
  }

  // Private helper methods

  private async waitForContent(): Promise<void> {
    // Wait a bit for dynamic content to load
    await new Promise(function resolve { return setTimeout(resolve, 500); });

    // Wait for images to finish loading
    var images = Array.from(document.images);
    if (images.length > 0) {
      var imagePromises = images.map(
        function img { return new Promise(resolve => {
            if (img.complete) {
              resolve(img);
            } else {
              img.addEventListener('load', () => resolve(img));
              img.addEventListener('error', () => resolve(img));
              // Timeout after 2 seconds
              setTimeout(() => resolve(img), 2000);
            }
          }); });
      await Promise.all(imagePromises);
    }
  }

  private findMainContent(options: ICoreExtractionOptions): Element | null {
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

  private cleanContent(element: Element, options: ICoreExtractionOptions): Element {
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
        // Additional check to avoid removing content that just happens to have "ad" in class
        var text = el.textContent || '';
        var wordCount = this.countWords(text);

        // If it's very short or has typical ad characteristics, remove it
        if (wordCount < 10 || this.hasAdCharacteristics(el)) {
          el.remove();
        }
      });
    });
  }

  private hasAdCharacteristics(element: Element): boolean {
    var className = element.className.toLowerCase();
    var id = element.id.toLowerCase();

    // Common ad patterns
    var adPatterns = [
      'advertisement',
      'google-ad',
      'adsense',
      'ad-banner',
      'ad-container',
      'ad-wrapper',
      'sponsored',
      'promo-box',
    ];

    return adPatterns.some(function pattern { return className.includes(pattern) || id.includes(pattern); });
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
        .map(function keyword { return keyword.trim(); })
        .filter(function keyword { return keyword.length > 0; });
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
      function () { return document.querySelector('[class*="author"]')?.textContent; },
      function () { return document.querySelector('.post-author')?.textContent; },
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
      /\/\d{4}\/\d{2}\/\d{2}\//,
      /\/\d{4}\/\d{2}\//,
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
      var elements = document.querySelectorAll(selector);
      return Array.from(elements).some(el => {
        var wordCount = this.countWords(el.textContent || '');
        return wordCount > 50; // Must have substantial content
      });
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
      var elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        var tagText = el.textContent?.trim();
        if (tagText && tagText.length > 0 && tagText.length < 50) {
          // Reasonable tag length
          tags.push(tagText);
        }
      });
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
