// Assisted using common GitHub development utilities
var GoogleJobsScraper = require('./google-jobs-scraper').GoogleJobsScraper;
var GoogleJobsStructuredScraper = require('./google-jobs-structured-scraper').GoogleJobsStructuredScraper;

export interface GoogleJobsScrapingOptions {
  query?: string
  location?: string
  maxPages?: number
  usePuppeteer?: boolean
  useStructured?: boolean
  maxResults?: number
}

class UnifiedGoogleJobsScraper {
  private puppeteerScraper: GoogleJobsScraper
  private structuredScraper: GoogleJobsStructuredScraper

  constructor() {
    this.puppeteerScraper = new GoogleJobsScraper()
    this.structuredScraper = new GoogleJobsStructuredScraper()
  }

  /**
   * Scrape Google Jobs using both approaches and merge results
   */
  async scrapeJobs(options: GoogleJobsScrapingOptions = {}): Promise<GoogleJobListing[]> {
    var query = options.query;
var location = options.location;
var maxPages = options.maxPages;
var usePuppeteer = options.usePuppeteer;
var useStructured = options.useStructured;
var maxResults = options.maxResults;console.log("Starting unified Google Jobs scraping: " + (query) + " in " + (location) + "")
    
    var allJobs: GoogleJobListing[] = []
    var errors: string[] = []

    // Try Puppeteer approach first (more reliable but slower)
    if (usePuppeteer) {
      try {
        console.log('Attempting Puppeteer scraping...')
        var puppeteerJobs = await this.puppeteerScraper.scrapeRemoteJobs(query, location, maxPages)
        allJobs.push(...puppeteerJobs)
        console.log("Puppeteer scraping found " + (puppeteerJobs.length) + " jobs")
      } catch (error) {
        var errorMsg = "Puppeteer scraping failed: " + (error instanceof Error ? error.message : 'Unknown error') + ""
        console.error(errorMsg)
        errors.push(errorMsg)
      } finally {
        // Always clean up Puppeteer resources
        try {
          await this.puppeteerScraper.close()
        } catch (cleanupError) {
          console.warn('Error closing Puppeteer:', cleanupError)
        }
      }
    }

    // If Puppeteer failed or didn't get enough results, try structured approach
    if (useStructured && (allJobs.length < maxResults / 2 || !usePuppeteer)) {
      try {
        console.log('Attempting structured scraping...')
        var structuredJobs = await this.structuredScraper.scrapeRemoteJobs(query, location, maxPages)
        
        // Merge and deduplicate
        var existingTitles = new Set(allJobs.map(function job { return "" + (job.title) + "-" + (job.company) + "".toLowerCase(); }))
        var newJobs = structuredJobs.filter(function job { return !existingTitles.has("" + (job.title) + "-" + (job.company) + "".toLowerCase()); })
        
        allJobs.push(...newJobs)
        console.log("Structured scraping found " + (structuredJobs.length) + " jobs (" + (newJobs.length) + " new)")
      } catch (error) {
        var errorMsg = "Structured scraping failed: " + (error instanceof Error ? error.message : 'Unknown error') + ""
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    // Deduplicate, score, and sort results
    var deduplicatedJobs = this.deduplicateJobs(allJobs)
    var scoredJobs = this.scoreAndSortJobs(deduplicatedJobs)
    var finalJobs = scoredJobs.slice(0, maxResults)

    console.log("Final result: " + (finalJobs.length) + " unique jobs from " + (allJobs.length) + " total scraped")
    
    if (errors.length > 0) {
      console.warn('Scraping completed with errors:', errors)
    }

    return finalJobs
  }

  /**
   * Remove duplicate jobs based on title, company, and description similarity
   */
  private deduplicateJobs(jobs: GoogleJobListing[]): GoogleJobListing[] {
    var seen = new Set<string>()
    var unique: GoogleJobListing[] = []

    for (var job of jobs) {
      // Create a key for deduplication
      var key = "" + (job.title.toLowerCase().trim()) + "-" + (job.company.toLowerCase().trim()) + ""
      
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(job)
      }
    }

    return unique
  }

  /**
   * Score jobs based on quality indicators and sort by score
   */
  private scoreAndSortJobs(jobs: GoogleJobListing[]): GoogleJobListing[] {
    return jobs
      .map(function job { return ({
        ...job,
        score: this.calculateJobScore(job)
      }); })
      .sort(function (a, b) { return (b as any).score - (a as any).score; })
      .map(function ({ score, ...job }) { return job; }) // Remove score from final result
  }

  /**
   * Calculate a quality score for a job (0-100)
   */
  private calculateJobScore(job: GoogleJobListing): number {
    var score = 50 // Base score

    // Title quality
    if (job.title.length > 10 && job.title.length < 100) score += 10
    if (job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead')) score += 5
    if (job.title.toLowerCase().includes('remote')) score += 10

    // Company quality
    if (job.company.length > 2 && !job.company.toLowerCase().includes('unknown')) score += 10

    // Description quality
    if (job.description.length > 200) score += 10
    if (job.description.length > 500) score += 5

    // Has apply URL (direct application)
    if (job.applyUrl && job.applyUrl.includes('http')) score += 15

    // Has salary information
    if (job.salaryText && job.salaryText.length > 5) score += 10

    // Remote indicators
    var remoteKeywords = ['remote', 'work from home', 'distributed', 'telecommute']
    var textToCheck = "" + (job.title) + " " + (job.location) + " " + (job.description) + "".toLowerCase()
    var remoteMatches = remoteKeywords.filter(function keyword { return textToCheck.includes(keyword); }).length
    score += remoteMatches * 3

    // Skills variety
    if (job.skills && job.skills.length > 0) {
      score += Math.min(job.skills.length * 2, 10)
    }

    // Employment type preference (full-time jobs score higher)
    if (job.employmentType === 'full-time') score += 5

    // Penalize very short descriptions or titles
    if (job.description.length < 50) score -= 10
    if (job.title.length < 5) score -= 15

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Get scraping statistics and health check
   */
  async getScrapingHealth(): Promise<{
    puppeteerAvailable: boolean
    structuredAvailable: boolean
    testResults: {
      puppeteer?: boolean
      structured?: boolean
    }
  }> {
    var health = {
      puppeteerAvailable: false,
      structuredAvailable: false,
      testResults: {} as any
    }

    // Test Puppeteer availability
    try {
      await this.puppeteerScraper.initialize()
      await this.puppeteerScraper.close()
      health.puppeteerAvailable = true
      health.testResults.puppeteer = true
    } catch (error) {
      console.warn('Puppeteer not available:', error)
      health.testResults.puppeteer = false
    }

    // Test structured scraper
    try {
      // Simple test to see if we can make a request
      var testJobs = await this.structuredScraper.scrapeRemoteJobs('test', 'US', 1)
      health.structuredAvailable = true
      health.testResults.structured = true
    } catch (error) {
      console.warn('Structured scraper not available:', error)
      health.testResults.structured = false
    }

    return health
  }

  /**
   * Clean up resources
   */
  async close(): Promise<void> {
    try {
      await this.puppeteerScraper.close()
    } catch (error) {
      console.warn('Error closing Puppeteer scraper:', error)
    }
  }
}

module.exports = UnifiedGoogleJobsScraper;
