// Aided with basic GitHub coding tools
import axios from 'axios'
import { parseString } from 'xml2js'
import { promisify } from 'util'

const parseXML = promisify(parseString)

interface RSSJob {
  title: string
  description: string
  link: string
  pubDate: string
  category?: string
  company?: string
  location?: string
  salary?: string
}

interface RSSFeed {
  name: string
  url: string
  enabled: boolean
  parser: (item: any) => RSSJob | null
}

// RSS Feed configurations
const RSS_FEEDS: RSSFeed[] = [
  {
    name: 'RemoteOK',
    url: 'https://remoteok.io/remote-jobs.rss',
    enabled: true,
    parser: (item: any) => {
      try {
        return {
          title: item.title?.[0] || '',
          description: item.description?.[0] || '',
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || '',
          company: extractCompanyFromTitle(item.title?.[0] || ''),
          location: 'Remote',
          category: item.category?.[0] || 'Technology'
        }
      } catch (error) {
        console.error('Error parsing RemoteOK item:', error)
        return null
      }
    }
  },
  {
    name: 'WeWorkRemotely Programming',
    url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    enabled: true,
    parser: (item: any) => {
      try {
        return {
          title: item.title?.[0] || '',
          description: item.description?.[0] || '',
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || '',
          company: extractCompanyFromDescription(item.description?.[0] || ''),
          location: 'Remote',
          category: 'Programming'
        }
      } catch (error) {
        console.error('Error parsing WeWorkRemotely item:', error)
        return null
      }
    }
  },
  {
    name: 'Indeed Remote',
    url: 'https://www.indeed.com/rss?q=remote+developer&l=',
    enabled: true,
    parser: (item: any) => {
      try {
        return {
          title: item.title?.[0] || '',
          description: item.description?.[0] || '',
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || '',
          company: extractCompanyFromTitle(item.title?.[0] || ''),
          location: 'Remote',
          category: 'Technology'
        }
      } catch (error) {
        console.error('Error parsing Indeed item:', error)
        return null
      }
    }
  },
  {
    name: 'FlexJobs',
    url: 'https://www.flexjobs.com/rss/remote-jobs',
    enabled: false, // Often requires authentication
    parser: (item: any) => {
      try {
        return {
          title: item.title?.[0] || '',
          description: item.description?.[0] || '',
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || '',
          company: extractCompanyFromTitle(item.title?.[0] || ''),
          location: 'Remote',
          category: 'General'
        }
      } catch (error) {
        console.error('Error parsing FlexJobs item:', error)
        return null
      }
    }
  }
]

// Helper functions
function extractCompanyFromTitle(title: string): string {
  // Try different patterns to extract company name
  const patterns = [
    /at\s+(.+?)(?:\s+\(|$|:)/i,
    /\|\s*(.+?)$/,
    /(.+?)\s*-\s*Remote/i,
    /^(.+?)\s*[:|-]/
  ]
  
  for (const pattern of patterns) {
    const match = title.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return 'Unknown Company'
}

function extractCompanyFromDescription(description: string): string {
  // Remove HTML tags and try to extract company name
  const cleanDesc = description.replace(/<[^>]*>/g, ' ').trim()
  const patterns = [
    /<strong>(.+?)<\/strong>/,
    /Company:\s*(.+?)(?:\n|<br>)/i,
    /^(.+?)\s*is\s+/i
  ]
  
  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return 'Unknown Company'
}

function extractSalaryFromText(text: string): string | undefined {
  const salaryRegex = /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:\/year|\/yr|annually|per year|k|K))?/i
  const match = text.match(salaryRegex)
  return match ? match[0] : undefined
}

// Helper function to extract skills from job text
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'Ruby',
    'Go', 'Rust', 'C++', 'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Git', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'TDD', 'Machine Learning', 'AI', 'Data Science',
    'HTML', 'CSS', 'SASS', 'SCSS', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js', 'Express', 'FastAPI',
    'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'Terraform', 'Jenkins', 'GitHub Actions'
  ]

  const foundSkills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  )

  return foundSkills.slice(0, 10) // Limit to 10 skills
}

function cleanDescription(description: string): string {
  // Remove HTML tags but preserve line breaks
  return description
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000) // Limit description length
}

// Main RSS scraper function
export async function scrapeRSSFeeds(): Promise<{
  success: boolean
  jobs: any[]
  errors: string[]
  totalJobs: number
  sources: { [key: string]: number }
}> {
  const allJobs: any[] = []
  const errors: string[] = []
  const sources: { [key: string]: number } = {}

  console.log('Starting RSS feed scraping...')

  for (const feed of RSS_FEEDS) {
    if (!feed.enabled) {
      console.log(`Skipping disabled feed: ${feed.name}`)
      sources[feed.name] = 0
      continue
    }

    try {
      console.log(`Scraping RSS feed: ${feed.name}`)
      
      const response = await axios.get(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        timeout: 15000, // 15 second timeout
        maxRedirects: 5
      })

      const xmlData = await parseXML(response.data) as any
      const items = xmlData?.rss?.channel?.[0]?.item || xmlData?.feed?.entry || []

      console.log(`Found ${items.length} items in ${feed.name}`)

      let feedJobCount = 0
      for (const item of items) {
        const job = feed.parser(item)
        if (job && job.title && job.link) {
          // Skip if job is too old (more than 30 days)
          const jobDate = new Date(job.pubDate || Date.now())
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          
          if (jobDate < thirtyDaysAgo) {
            continue
          }          // Convert RSS job to database format
          const dbJob = {
            title: job.title.trim(),
            description: cleanDescription(job.description || ''),
            company_name: job.company || 'Unknown Company',
            location: job.location || 'Remote',
            employment_type: 'full-time',
            remote_type: 'remote', // Use existing enum value
            skills: extractSkillsFromText(job.title + ' ' + job.description),
            apply_url: job.link,
            source: feed.name, // Will be ignored if column doesn't exist
            posted_at: new Date(job.pubDate || Date.now()).toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            is_active: false, // Require admin approval
            salary_text: extractSalaryFromText(job.title + ' ' + job.description), // Will be ignored if column doesn't exist
            feed_source: feed.name, // Store source info in temp field
            salary_info: extractSalaryFromText(job.title + ' ' + job.description) // Store salary info temporarily
          }

          allJobs.push(dbJob)
          feedJobCount++
        }
      }

      sources[feed.name] = feedJobCount
      console.log(`Successfully scraped ${feedJobCount} jobs from ${feed.name}`)

    } catch (error: any) {
      const errorMsg = `Error scraping ${feed.name}: ${error.message}`
      console.error(errorMsg)
      errors.push(errorMsg)
      sources[feed.name] = 0
    }
  }

  return {
    success: errors.length < RSS_FEEDS.filter(f => f.enabled).length, // Success if at least one feed works
    jobs: allJobs,
    errors,
    totalJobs: allJobs.length,
    sources
  }
}

// Function to get enabled RSS feeds (for admin configuration)
export function getRSSFeeds(): RSSFeed[] {
  return RSS_FEEDS
}

// Function to update RSS feed configuration
export function updateRSSFeedConfig(feedName: string, enabled: boolean): boolean {
  const feed = RSS_FEEDS.find(f => f.name === feedName)
  if (feed) {
    feed.enabled = enabled
    return true
  }
  return false
}
