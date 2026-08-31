// Assisted using common GitHub development utilities
import puppeteer, { Browser, Page } from 'puppeteer'
import puppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// Add stealth plugin
puppeteerExtra.use(StealthPlugin())

export interface GoogleJobListing {
  title: string
  company: string
  location: string
  description: string
  employmentType?: string
  remoteType?: string
  salaryText?: string
  applyUrl?: string
  postedAt?: string
  skills?: string[]
}

export class GoogleJobsScraper {
  private browser: Browser | null = null
  private maxRetries = 3
  private delayBetweenJobs = 1000 // 1 second delay between job detail fetches

  async initialize(): Promise<void> {
    this.browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ]
    })
  }

  async scrapeRemoteJobs(query = 'remote software developer', location = 'United States', maxPages = 3): Promise<GoogleJobListing[]> {
    if (!this.browser) {
      await this.initialize()
    }

    const page = await this.browser!.newPage()
    const jobs: GoogleJobListing[] = []

    try {
      // Set realistic viewport and headers
      await page.setViewport({ width: 1366, height: 768 })
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

      // Navigate to Google Jobs search
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&ibp=htl;jobs`
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 })

      // Wait for jobs to load
      await this.waitForJobsToLoad(page)

      for (let pageNum = 0; pageNum < maxPages; pageNum++) {
        console.log(`Scraping Google Jobs page ${pageNum + 1}...`)

        // Get job listings on current page
        const pageJobs = await this.extractJobsFromPage(page)
        jobs.push(...pageJobs)

        // Try to navigate to next page
        if (pageNum < maxPages - 1) {
          const hasNextPage = await this.goToNextPage(page)
          if (!hasNextPage) {
            console.log('No more pages available')
            break
          }
          await this.waitForJobsToLoad(page)
        }
      }

      console.log(`Scraped ${jobs.length} jobs from Google Jobs`)
      return jobs

    } catch (error) {
      console.error('Error scraping Google Jobs:', error)
      throw error
    } finally {
      await page.close()
    }
  }

  private async waitForJobsToLoad(page: Page): Promise<void> {
    try {
      // Wait for job listings container
      await page.waitForSelector('[data-ved][jsname]', { timeout: 15000 })
      
      // Additional wait for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Scroll to load more jobs
      await this.scrollToLoadJobs(page)
    } catch (error) {
      console.warn('Timeout waiting for jobs to load:', error)
    }
  }

  private async scrollToLoadJobs(page: Page): Promise<void> {
    let previousJobCount = 0
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      // Count current job elements
      const currentJobCount = await page.$$eval(
        '[data-ved][jsname]',
        (elements) => elements.length
      )

      if (currentJobCount === previousJobCount) {
        attempts++
      } else {
        attempts = 0
        previousJobCount = currentJobCount
      }

      // Scroll down
      await page.evaluate(() => {
        window.scrollBy(0, 1000)
      })

      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  private async extractJobsFromPage(page: Page): Promise<GoogleJobListing[]> {
    try {
      const jobElements = await page.$$('[data-ved][jsname]')
      const jobs: GoogleJobListing[] = []

      for (let i = 0; i < Math.min(jobElements.length, 20); i++) {
        try {
          const jobElement = jobElements[i]
          
          // Click on job to expand details
          await jobElement.click()
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenJobs))

          // Extract job details
          const jobData = await page.evaluate(() => {
            const titleElement = document.querySelector('[data-test-id="job-title"]') || 
                                document.querySelector('h2[data-ved]') ||
                                document.querySelector('.jobTitle')
            
            const companyElement = document.querySelector('[data-test-id="employer-name"]') ||
                                 document.querySelector('.companyName') ||
                                 document.querySelector('div[data-ved] span')

            const locationElement = document.querySelector('[data-test-id="job-location"]') ||
                                  document.querySelector('.locationsContainer')

            const descriptionElement = document.querySelector('[data-test-id="job-description"]') ||
                                     document.querySelector('.jobDescription') ||
                                     document.querySelector('[role="main"] div[data-ved]')

            const salaryElement = document.querySelector('[data-test-id="salary-range"]') ||
                                document.querySelector('.salary')

            const applyElement = document.querySelector('a[data-test-id="apply-button"]') ||
                               document.querySelector('a[href*="apply"]') ||
                               document.querySelector('a[aria-label*="Apply"]')

            const postedElement = document.querySelector('[data-test-id="posted-date"]') ||
                                document.querySelector('.posted')

            return {
              title: titleElement?.textContent?.trim() || '',
              company: companyElement?.textContent?.trim() || '',
              location: locationElement?.textContent?.trim() || '',
              description: descriptionElement?.textContent?.trim() || '',
              salaryText: salaryElement?.textContent?.trim(),
              applyUrl: applyElement?.getAttribute('href'),
              postedAt: postedElement?.textContent?.trim()
            }
          })

          if (jobData.title && jobData.company) {
            const processedJob = this.processJobData(jobData)
            if (this.isRemoteJob(processedJob)) {
              jobs.push(processedJob)
            }
          }

        } catch (error) {
          console.warn(`Error extracting job ${i}:`, error)
          continue
        }
      }

      return jobs

    } catch (error) {
      console.error('Error extracting jobs from page:', error)
      return []
    }
  }

  private processJobData(rawJob: any): GoogleJobListing {
    const processed: GoogleJobListing = {
      title: rawJob.title,
      company: rawJob.company,
      location: rawJob.location,
      description: rawJob.description
    }

    // Process employment type
    const title = rawJob.title.toLowerCase()
    const description = rawJob.description.toLowerCase()
    
    if (title.includes('intern') || description.includes('internship')) {
      processed.employmentType = 'internship'
    } else if (title.includes('contract') || title.includes('freelance') || description.includes('contractor')) {
      processed.employmentType = 'contract'
    } else if (title.includes('part-time') || title.includes('part time')) {
      processed.employmentType = 'part-time'
    } else {
      processed.employmentType = 'full-time'
    }

    // Process remote type
    const locationText = rawJob.location.toLowerCase()
    if (locationText.includes('remote') || locationText.includes('anywhere') || locationText.includes('work from home')) {
      processed.remoteType = 'fully-remote'
    } else if (locationText.includes('hybrid')) {
      processed.remoteType = 'hybrid'
    } else {
      processed.remoteType = 'remote-allowed'
    }

    // Extract skills from description
    processed.skills = this.extractSkills(rawJob.description)

    // Clean up salary text
    if (rawJob.salaryText) {
      processed.salaryText = rawJob.salaryText.replace(/[\n\r]+/g, ' ').trim()
    }

    // Clean up apply URL
    if (rawJob.applyUrl) {
      processed.applyUrl = rawJob.applyUrl.startsWith('http') 
        ? rawJob.applyUrl 
        : `https://www.google.com${rawJob.applyUrl}`
    }

    return processed
  }

  private extractSkills(description: string): string[] {
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java',
      'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GraphQL', 'REST', 'API',
      'HTML', 'CSS', 'SASS', 'Next.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'
    ]

    const skills: string[] = []
    const descLower = description.toLowerCase()

    skillKeywords.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        skills.push(skill)
      }
    })

    return Array.from(new Set(skills)) // Remove duplicates
  }

  private isRemoteJob(job: GoogleJobListing): boolean {
    const searchTerms = ['remote', 'work from home', 'telecommute', 'distributed', 'anywhere']
    const textToSearch = `${job.title} ${job.location} ${job.description}`.toLowerCase()
    
    return searchTerms.some(term => textToSearch.includes(term))
  }

  private async goToNextPage(page: Page): Promise<boolean> {
    try {
      // Look for next page button
      const nextButton = await page.$('a[aria-label="Next"]') || 
                        await page.$('a[id="pnnext"]') ||
                        await page.$('span[style*="background-image"] + a')

      if (nextButton) {
        await nextButton.click()
        await new Promise(resolve => setTimeout(resolve, 3000))
        return true
      }

      return false
    } catch (error) {
      console.warn('Error navigating to next page:', error)
      return false
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

export default GoogleJobsScraper
