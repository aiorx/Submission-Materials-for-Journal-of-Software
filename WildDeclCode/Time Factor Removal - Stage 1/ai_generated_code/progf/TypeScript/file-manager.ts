// Aided with basic GitHub coding tools
// Unified File Manager - Consolidates file naming, organization, and GitHub operations
// Combines FileManager and GitHubFileManager into a single, comprehensive service

var IDocumentMetadata = require('../types/types.js').IDocumentMetadata;
var IFileOperationResult = require('../types/types.js').IFileOperationResult;
var createLogger = require('./logger.js').createLogger;

var logger = createLogger('FileManager');

interface IFolderMapping {
  [key: string]: string[];
}

interface IFileNameComponents {
  date: string;
  domain: string;
  title: string;
  extension: string;
}

interface IFileManagerOptions {
  customNamingPattern?: string;
  fileNamingPattern?: string;
  defaultFolder?: string;
  customFolder?: string;
}

export interface IGitHubSettings {
  token: string;
  repository: string;
  branch?: string;
}

export interface IGitHubCommitParams {
  token: string;
  repo: string;
  filePath: string;
  content: string;
  message: string;
  url?: string;
}

export interface IGitHubCommitResult {
  success: boolean;
  data?: {
    html_url?: string;
    sha?: string;
    [key: string]: unknown;
  };
  error?: string;
}

export interface IGitHubFileInfo {
  sha: string;
  content: string;
  encoding: string;
}

export interface IRepositoryInfo {
  owner: string;
  repo: string;
}

class FileManager {
  private static readonly API_BASE = 'https://api.github.com';
  private static readonly USER_AGENT = 'PrismWeave-Extension/1.0';
  private readonly folderMapping: IFolderMapping;

  constructor() {
    this.folderMapping = {
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
        'dev',
        'developer',
        'mozilla',
        'typescript',
        'haskell',
        'unison',
        'testing',
        'frontend',
        'backend',
        'api',
        'web',
        'code',
        'engineering',
        'computer',
        'ai',
        'machine-learning',
        'ocr',
        'document-processing',
        'ai-assisted-programming',
        'llm',
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
        'leadership',
        'ceo',
        'fortune',
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
        'complete',
        'beginner',
        'introduction',
        'getting-started',
        'setup',
        'install',
        'configure',
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
        'industry',
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
        'arxiv',
        'institute',
      ],
      design: ['design', 'ui', 'ux', 'css', 'figma', 'adobe', 'creative', 'visual', 'art'],
      tools: ['tool', 'utility', 'software', 'app', 'service', 'platform', 'extension'],
      personal: ['personal', 'diary', 'journal', 'thoughts', 'reflection', 'life', 'experience'],
      reference: ['reference', 'documentation', 'manual', 'spec', 'api', 'docs', 'wiki'],
    };
  }

  // =============================================================================
  // FILE NAMING AND ORGANIZATION METHODS
  // =============================================================================

  /**
   * Generate filename from metadata and settings
   */
  generateFilename(metadata: IDocumentMetadata, options: IFileManagerOptions = {}): string {
    try {
      var components = this.extractFileNameComponents(metadata);
      var pattern = options.fileNamingPattern || 'YYYY-MM-DD-domain-title';

      return this.applyNamingPattern(components, pattern, options);
    } catch (error) {
      logger.error('Error generating filename:', error);
      return this.getFallbackFilename(metadata);
    }
  }

  /**
   * Determine appropriate folder for content based on metadata
   */
  determineFolder(metadata: IDocumentMetadata, options: IFileManagerOptions = {}): string {
    // Use explicit folder setting if provided
    if (options.defaultFolder === 'custom' && options.customFolder) {
      return this.sanitizeFolderName(options.customFolder);
    }

    if (options.defaultFolder && options.defaultFolder !== 'auto') {
      return options.defaultFolder;
    }

    // Auto-detect folder based on content
    var detectedFolder = this.autoDetectFolder(metadata);
    return detectedFolder || 'unsorted';
  }

  /**
   * Generate complete file path including folder structure
   */
  generateFilePath(metadata: IDocumentMetadata, options: IFileManagerOptions = {}): string {
    var folder = this.determineFolder(metadata, options);
    var filename = this.generateFilename(metadata, options);

    return "documents/" + (folder) + "/" + (filename) + "";
  }

  /**
   * Validate file path for safety and compliance
   */
  validateFilePath(filePath: string): { isValid: boolean; errors: string[] } {
    var errors: string[] = [];

    // Check for dangerous characters
    var dangerousChars = /[<>:"|?*\x00-\x1f]/;
    if (dangerousChars.test(filePath)) {
      errors.push('File path contains invalid characters');
    }

    // Check path length
    if (filePath.length > 260) {
      errors.push('File path is too long (max 260 characters)');
    }

    // Check for reserved names
    var reservedNames = [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9',
    ];
    var filename = filePath.split('/').pop()?.split('.')[0]?.toUpperCase();
    if (filename && reservedNames.includes(filename)) {
      errors.push('Filename uses reserved system name');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create unique filename to avoid conflicts
   */
  createUniqueFilename(basePath: string, existingFiles: string[] = []): string {
    var pathParts = basePath.split('/');
    var filename = pathParts.pop() || '';
    var directory = pathParts.join('/');

    var [name, extension] = this.splitFilename(filename);

    var counter = 1;
    var uniquePath = basePath;

    while (existingFiles.includes(uniquePath)) {
      var uniqueName = "" + (name) + "-" + (counter) + "." + (extension) + "";
      uniquePath = directory ? "" + (directory) + "/" + (uniqueName) + "" : uniqueName;
      counter++;
    }

    return uniquePath;
  }

  /**
   * Organize files into folder structure
   */
  organizeFiles(
    files: Array<{ metadata: IDocumentMetadata; content: string }>,
    options: IFileManagerOptions = {}
  ): Record<string, Array<{ filename: string; content: string; metadata: IDocumentMetadata }>> {
    var organized: Record<
      string,
      Array<{ filename: string; content: string; metadata: IDocumentMetadata }>
    > = {};

    files.forEach(function file {
      var folder = this.determineFolder(file.metadata, options);
      var filename = this.generateFilename(file.metadata, options);

      if (!organized[folder]) {
        organized[folder] = [];
      }

      organized[folder].push({
        filename,
        content: file.content,
        metadata: file.metadata,
      });
    });

    return organized;
  }

  // =============================================================================
  // GITHUB OPERATIONS METHODS
  // =============================================================================

  /**
   * Save markdown file to GitHub with automatic file naming and organization
   */
  async saveToGitHub(
    content: string,
    metadata: IDocumentMetadata,
    githubSettings: IGitHubSettings,
    options: IFileManagerOptions = {}
  ): Promise<IFileOperationResult> {
    try {
      // Generate file path using naming/organization logic
      var fullPath = this.generateFilePath(metadata, options);
      var validation = this.validateFilePath(fullPath);

      if (!validation.isValid) {
        return {
          success: false,
          filePath: fullPath,
          error: "Invalid file path: " + (validation.errors.join(', ')) + "",
        };
      }

      // Create commit message
      var commitMessage = this.generateCommitMessage(metadata, fullPath);

      // Commit to GitHub
      var githubResult = await this.commitToGitHub({
        token: githubSettings.token,
        repo: githubSettings.repository,
        filePath: fullPath,
        content,
        message: commitMessage,
        url: metadata.url,
      });

      var result: IFileOperationResult = {
        success: githubResult.success,
        filePath: fullPath,
      };

      if (githubResult.data?.sha) {
        result.sha = githubResult.data.sha;
      }

      if (githubResult.data?.html_url) {
        result.url = githubResult.data.html_url;
      }

      if (githubResult.error) {
        result.error = githubResult.error;
      }

      return result;
    } catch (error) {
      logger.error('Error saving to GitHub:', error);
      return {
        success: false,
        filePath: '',
        error: (error as Error).message,
      };
    }
  }

  /**
   * Commit content to GitHub repository with automatic file creation/update
   */
  async commitToGitHub(params: IGitHubCommitParams): Promise<IGitHubCommitResult> {
    try {
      var token = params.token;
var repo = params.repo;
var filePath = params.filePath;
var content = params.content;
var message = params.message;

      logger.info('Starting GitHub commit process:', {
        repo,
        filePath,
        messageLength: message.length,
        contentLength: content.length,
      });

      // Validate and parse repository
      var repoInfo = this.parseRepositoryPath(repo);
      logger.debug('Parsed repository:', repoInfo);

      // Check if file already exists
      var existingFile = await this.getFileInfo(token, repoInfo, filePath);
      logger.debug('File existence check:', {
        exists: !!existingFile,
        sha: existingFile?.sha,
      });

      // Create or update the file
      var result = await this.createOrUpdateFile(
        token,
        repoInfo,
        filePath,
        content,
        message,
        existingFile?.sha
      );

      logger.info('Successfully committed to GitHub:', result.content?.html_url);

      return {
        success: true,
        data: result.content,
      };
    } catch (error) {
      logger.error('GitHub commit failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test GitHub connection and permissions
   */
  async testGitHubConnection(
    token: string,
    repo: string
  ): Promise<{
    success: boolean;
    status: string;
    message?: string;
    details?: Record<string, unknown>;
    error?: string;
  }> {
    try {
      logger.info('Testing GitHub connection...');

      // Validate inputs
      if (!token || !repo) {
        return {
          success: false,
          status: 'failed',
          error: 'GitHub token and repository are required',
        };
      }

      // Parse repository
      var repoInfo = this.parseRepositoryPath(repo);

      // Test 1: Validate GitHub token
      var userData = await this.validateToken(token);

      // Test 2: Check repository access
      var repoData = await this.validateRepository(token, repoInfo);

      // Test 3: Check write permissions
      var hasWriteAccess = await this.checkWritePermissions(token, repoInfo);

      return {
        success: true,
        status: 'connected',
        message: 'GitHub connection test successful',
        details: {
          user: userData.login,
          userType: userData.type,
          repository: repoData.full_name,
          repositoryPrivate: repoData.private,
          hasWriteAccess,
          permissions: repoData.permissions || { admin: false, push: false, pull: true },
        },
      };
    } catch (error) {
      logger.error('GitHub connection test failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // =============================================================================
  // UTILITY AND PREVIEW METHODS
  // =============================================================================

  /**
   * Generate file preview with validation and warnings
   */
  generateFilePreview(
    metadata: IDocumentMetadata,
    options: IFileManagerOptions = {}
  ): {
    filename: string;
    folder: string;
    fullPath: string;
    isValid: boolean;
    warnings: string[];
  } {
    var filename = this.generateFilename(metadata, options);
    var folder = this.determineFolder(metadata, options);
    var fullPath = "" + (folder) + "/" + (filename) + "";
    var validation = this.validateFilePath(fullPath);

    var warnings: string[] = [];

    // Check for potential issues
    if (filename.length > 100) {
      warnings.push('Filename is quite long and may cause issues on some systems');
    }

    if (metadata.title.length < 5) {
      warnings.push('Document title is very short, consider adding more descriptive content');
    }

    return {
      filename,
      folder,
      fullPath,
      isValid: validation.isValid,
      warnings: [...warnings, ...validation.errors],
    };
  }

  // Public utility methods
  getAvailableFolders(): string[] {
    return Object.keys(this.folderMapping);
  }

  getFolderKeywords(folder: string): string[] {
    return this.folderMapping[folder] || [];
  }

  addFolderKeywords(folder: string, keywords: string[]): void {
    if (!this.folderMapping[folder]) {
      this.folderMapping[folder] = [];
    }

    keywords.forEach(function keyword {
      if (!this.folderMapping[folder].includes(keyword.toLowerCase())) {
        this.folderMapping[folder].push(keyword.toLowerCase());
      }
    });
  }

  getFileStats(filePath: string): { folder: string; filename: string; extension: string } {
    var parts = filePath.split('/');
    var filename = parts.pop() || '';
    var folder = parts.join('/') || '';
    var [name, extension] = this.splitFilename(filename);

    return { folder, filename: name, extension };
  }

  // =============================================================================
  // PRIVATE HELPER METHODS (FILE NAMING)
  // =============================================================================

  private extractFileNameComponents(metadata: IDocumentMetadata): IFileNameComponents {
    var date = this.formatDate(new Date(metadata.captureDate));
    var domain = this.extractDomain(metadata.url);
    var title = this.sanitizeTitle(metadata.title);

    return {
      date,
      domain,
      title,
      extension: 'md',
    };
  }

  private applyNamingPattern(
    components: IFileNameComponents,
    pattern: string,
    options: IFileManagerOptions = {}
  ): string {
    if (pattern === 'custom' && options.customNamingPattern) {
      pattern = options.customNamingPattern;
    }

    var filename = pattern
      .replace(/YYYY/g, components.date.substring(0, 4))
      .replace(/MM/g, components.date.substring(5, 7))
      .replace(/DD/g, components.date.substring(8, 10))
      .replace(/domain/g, components.domain)
      .replace(/title/g, components.title);

    // Add extension if not present
    if (!filename.endsWith("." + (components.extension) + "")) {
      filename += "." + (components.extension) + "";
    }

    return this.sanitizeFilename(filename);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private extractDomain(url: string): string {
    try {
      var urlObj = new URL(url);
      var domain = urlObj.hostname;

      // Remove www. prefix
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }

      // For known domains, keep meaningful subdomains
      var meaningfulSubdomains = ['developer', 'docs', 'api', 'blog', 'news'];
      var domainParts = domain.split('.');

      if (domainParts.length > 2) {
        var subdomain = domainParts[0];
        var mainDomain = domainParts.slice(-2).join('.');

        // Keep meaningful subdomains
        if (meaningfulSubdomains.includes(subdomain.toLowerCase())) {
          domain = "" + (subdomain) + "." + (mainDomain) + "";
        } else {
          // For other subdomains, just use main domain
          domain = mainDomain;
        }
      }

      return domain.replace(/\./g, '-');
    } catch {
      return 'unknown-site';
    }
  }

  private sanitizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"|?*\x00-\x1f]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  private sanitizeFolderName(folderName: string): string {
    return folderName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private getFallbackFilename(metadata: IDocumentMetadata): string {
    var date = this.formatDate(new Date(metadata.captureDate));
    var title = this.sanitizeTitle(metadata.title || 'untitled');
    return "" + (date) + "-" + (title) + ".md";
  }

  private autoDetectFolder(metadata: IDocumentMetadata): string | null {
    // Prepare search content from multiple sources
    var searchSources = [
      metadata.title.toLowerCase(),
      metadata.url.toLowerCase(),
      ...metadata.tags.map(function tag { return tag.toLowerCase(); }),
      ...this.extractUrlKeywords(metadata.url),
    ];

    var searchText = searchSources.join(' ');

    // Score each folder based on keyword matches
    var folderScores: Record<string, number> = {};

    Object.entries(this.folderMapping).forEach(function ([folder, keywords]) {
      var score = 0;

      keywords.forEach(keyword => {
        // Check for exact word matches (word boundaries)
        var wordBoundaryRegex = new RegExp(
          "\\b" + (keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) + "\\b",
          'gi'
        );
        var matches = searchText.match(wordBoundaryRegex);
        if (matches) {
          score += matches.length;
        }

        // Additional scoring for URL domain matches
        if (metadata.url.toLowerCase().includes(keyword)) {
          score += 0.5; // Bonus points for URL matches
        }
      });

      if (score > 0) {
        folderScores[folder] = score;
      }
    });

    // Return folder with highest score, but only if score is meaningful
    var sortedFolders = Object.entries(folderScores).sort(function ([, a], [, b]) { return b - a; });
    var bestMatch = sortedFolders[0];

    // Require minimum score threshold to avoid false positives
    return bestMatch && bestMatch[1] >= 1 ? bestMatch[0] : null;
  }

  /**
   * Extract keywords from URL for enhanced folder detection
   */
  private extractUrlKeywords(url: string): string[] {
    try {
      var urlObj = new URL(url);
      var keywords: string[] = [];

      // Extract from hostname
      var hostname = urlObj.hostname.toLowerCase();

      // Remove www prefix and split by dots
      var domainParts = hostname.replace(/^www\./, '').split('.');
      keywords.push(...domainParts);

      // Extract meaningful parts from domain
      if (hostname.includes('github')) keywords.push('github', 'development', 'code');
      if (hostname.includes('stackoverflow'))
        keywords.push('stackoverflow', 'programming', 'development');
      if (hostname.includes('developer')) keywords.push('developer', 'development', 'tech');
      if (hostname.includes('mozilla')) keywords.push('mozilla', 'developer', 'web', 'tech');
      if (hostname.includes('linkedin')) keywords.push('linkedin', 'business', 'professional');
      if (hostname.includes('dev.to') || hostname.includes('dev'))
        keywords.push('dev', 'development', 'programming');
      if (hostname.includes('blog')) keywords.push('blog', 'article');
      if (hostname.includes('tutorial')) keywords.push('tutorial', 'guide');
      if (hostname.includes('news')) keywords.push('news', 'article');
      if (hostname.includes('research') || hostname.includes('arxiv'))
        keywords.push('research', 'academic');

      // Extract from pathname
      var pathParts = urlObj.pathname
        .toLowerCase()
        .split('/')
        .filter(function part { return part.length > 2; });
      keywords.push(...pathParts);

      // Clean and filter keywords
      return keywords
        .map(function keyword { return keyword.replace(/[^a-z0-9]/g, ''); })
        .filter(function keyword { return keyword.length > 2; })
        .filter(function keyword { return !['com', 'org', 'net', 'www', 'http', 'https'].includes(keyword); });
    } catch (error) {
      // If URL parsing fails, return empty array
      return [];
    }
  }

  private splitFilename(filename: string): [string, string] {
    var lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) {
      return [filename, 'md'];
    }

    return [filename.substring(0, lastDot), filename.substring(lastDot + 1)];
  }

  private generateCommitMessage(metadata: IDocumentMetadata, filePath: string): string {
    var folder = this.getFileStats(filePath).folder;
    var domain = this.extractDomain(metadata.url);
    return "Add " + (folder) + " article from " + (domain) + ": " + (metadata.title) + "";
  }

  // =============================================================================
  // PRIVATE HELPER METHODS (GITHUB OPERATIONS)
  // =============================================================================

  /**
   * Parse repository path into owner and repo components
   */
  private parseRepositoryPath(repoPath: string): IRepositoryInfo {
    if (!repoPath) {
      throw new Error('Repository path is required');
    }

    // Handle different repository path formats
    var cleanPath = repoPath;

    // Remove GitHub URL prefixes if present
    cleanPath = cleanPath.replace(/^https?:\/\/github\.com\//, '');
    cleanPath = cleanPath.replace(/\.git$/, '');

    var parts = cleanPath.split('/');

    if (parts.length < 2) {
      throw new Error('Invalid repository path format. Expected: owner/repo');
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  }

  /**
   * Get file information from GitHub if it exists
   */
  private async getFileInfo(
    token: string,
    repoInfo: IRepositoryInfo,
    path: string
  ): Promise<IGitHubFileInfo | null> {
    logger.debug('Fetching file info for:', {
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      path,
    });

    try {
      var response = await fetch(
        "" + (FileManager.API_BASE) + "/repos/" + (repoInfo.owner) + "/" + (repoInfo.repo) + "/contents/" + (path) + "",
        {
          method: 'GET',
          headers: this.getAuthHeaders(token),
        }
      );

      if (response.status === 404) {
        logger.debug('File not found (404), returning null');
        return null;
      }

      if (!response.ok) {
        throw new Error("GitHub API error: " + (response.status) + " " + (response.statusText) + "");
      }

      var data = (await response.json()) as IGitHubFileInfo;

      if (!data.sha) {
        throw new Error('Invalid file info from GitHub: missing SHA');
      }

      return data;
    } catch (error) {
      if ((error as Error).message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create or update a file in the GitHub repository
   */
  private async createOrUpdateFile(
    token: string,
    repoInfo: IRepositoryInfo,
    path: string,
    content: string,
    message: string,
    existingSha?: string
  ): Promise<any> {
    logger.debug('Creating or updating file:', {
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      path,
      contentLength: content.length,
      operation: existingSha ? 'UPDATE' : 'CREATE',
    });

    var requestBody: any = {
      message,
      // For binary files (PDF), content is already base64 encoded
      // For text files, we need to encode to base64
      content: path.endsWith('.pdf') ? content : btoa(unescape(encodeURIComponent(content))),
      branch: 'main',
    };

    if (existingSha) {
      requestBody.sha = existingSha;
      logger.info('Including SHA for file update:', existingSha);
    }

    var response = await fetch(
      "" + (FileManager.API_BASE) + "/repos/" + (repoInfo.owner) + "/" + (repoInfo.repo) + "/contents/" + (path) + "",
      {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      var errorData = await response.json().catch(function () { return ({}); });
      var errorMessage = "GitHub API error: " + (response.status) + " - " + (errorData.message || 'Unknown error') + "";
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  /**
   * Validate GitHub token by fetching user info
   */
  private async validateToken(token: string): Promise<any> {
    logger.debug('Validating GitHub token...');

    var response = await fetch("" + (FileManager.API_BASE) + "/user", {
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Invalid GitHub token (" + (response.status) + ")");
    }

    var userData = await response.json();
    logger.debug('GitHub user validated:', userData.login);
    return userData;
  }

  /**
   * Validate repository access
   */
  private async validateRepository(token: string, repoInfo: IRepositoryInfo): Promise<any> {
    logger.debug('Validating repository access...');

    var response = await fetch(
      "" + (FileManager.API_BASE) + "/repos/" + (repoInfo.owner) + "/" + (repoInfo.repo) + "",
      {
        headers: this.getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      var errorMsg =
        response.status === 404
          ? 'Repository not found or no access'
          : "Repository access failed (" + (response.status) + ")";
      throw new Error(errorMsg);
    }

    var repoData = await response.json();
    logger.debug('Repository access confirmed:', repoData.full_name);
    return repoData;
  }

  /**
   * Check write permissions by testing contents API
   */
  private async checkWritePermissions(token: string, repoInfo: IRepositoryInfo): Promise<boolean> {
    logger.debug('Testing write permissions...');

    try {
      var response = await fetch(
        "" + (FileManager.API_BASE) + "/repos/" + (repoInfo.owner) + "/" + (repoInfo.repo) + "/contents",
        {
          headers: this.getAuthHeaders(token),
        }
      );

      var hasAccess = response.ok;
      if (!hasAccess) {
        logger.warn('Limited repository access - may not have write permissions');
      }

      return hasAccess;
    } catch (error) {
      logger.warn('Write permission check failed:', error);
      return false;
    }
  }

  /**
   * Get standard authentication headers for GitHub API
   */
  private getAuthHeaders(token: string): Record<string, string> {
    return {
      Authorization: "token " + (token) + "",
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': FileManager.USER_AGENT,
    };
  }
}
