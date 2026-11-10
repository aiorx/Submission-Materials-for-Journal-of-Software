// Aided with basic GitHub coding tools
var axios = require('axios');
var parseString = require('xml2js').parseString;
var promisify = require('util').promisify;

var parseXML = promisify(parseString)

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
  parser: function (item: any) { return RSSJob | null; }}

// RSS Feed configurations
var RSS_FEEDS: RSSFeed[] = [
  {
    name: 'RemoteOK',
    url: 'https://remoteok.io/remote-jobs.rss',
    enabled: true,
    parser: function (item: any) {
      try {
        return {
          title: (item.title == null ? undefined : item.title[0]) || '',
          description: (item.description == null ? undefined : item.description[0]) || '',
          link: (item.link == null ? undefined : item.link[0]) || '',
          pubDate: (item.pubDate == null ? undefined : item.pubDate[0]) || '',
          company: extractCompanyFromTitle((item.title == null ? undefined : item.title[0]) || ''),
          location: 'Remote',
          category: (item.category == null ? undefined : item.category[0]) || 'Technology'
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
    parser: function (item: any) {
      try {
        return {
          title: (item.title == null ? undefined : item.title[0]) || '',
          description: (item.description == null ? undefined : item.description[0]) || '',
          link: (item.link == null ? undefined : item.link[0]) || '',
          pubDate: (item.pubDate == null ? undefined : item.pubDate[0]) || '',
          company: extractCompanyFromDescription((item.description == null ? undefined : item.description[0]) || ''),
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
    parser: function (item: any) {
      try {
        return {
          title: (item.title == null ? undefined : item.title[0]) || '',
          description: (item.description == null ? undefined : item.description[0]) || '',
          link: (item.link == null ? undefined : item.link[0]) || '',
          pubDate: (item.pubDate == null ? undefined : item.pubDate[0]) || '',
          company: extractCompanyFromTitle((item.title == null ? undefined : item.title[0]) || ''),
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
    parser: function (item: any) {
      try {
        return {
          title: (item.title == null ? undefined : item.title[0]) || '',
          description: (item.description == null ? undefined : item.description[0]) || '',
          link: (item.link == null ? undefined : item.link[0]) || '',
          pubDate: (item.pubDate == null ? undefined : item.pubDate[0]) || '',
          company: extractCompanyFromTitle((item.title == null ? undefined : item.title[0]) || ''),
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
  var patterns = [
    /at\s+(.+?)(?:\s+\(|$|:)/i,
    /\|\s*(.+?)$/,
    /(.+?)\s*-\s*Remote/i,
    /^(.+?)\s*[:|-]/
  ]
  
  for (var pattern of patterns) {
    var match = title.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return 'Unknown Company'
}

function extractCompanyFromDescription(description: string): string {
  // Remove HTML tags and try to extract company name
  var cleanDesc = description.replace(/<[^>]*>/g, ' ').trim()
  var patterns = [
    /<strong>(.+?)<\/strong>/,
    /Company:\s*(.+?)(?:\n|<br>)/i,
    /^(.+?)\s*is\s+/i
  ]
  
  for (var pattern of patterns) {
    var match = description.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return 'Unknown Company'
}

function extractSalaryFromText(text: string): string | undefined {
  var salaryRegex = /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:\/year|\/yr|annually|per year|k|K))?/i
  var match = text.match(salaryRegex)
  return match ? match[0] : undefined
}

// Helper function to extract skills from job text
function extractSkillsFromText(text: string): string[] {
  var commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'Ruby',
    'Go', 'Rust', 'C++', 'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Git', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'TDD', 'Machine Learning', 'AI', 'Data Science',
    'HTML', 'CSS', 'SASS', 'SCSS', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js', 'Express', 'FastAPI',
    'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'Terraform', 'Jenkins', 'GitHub Actions'
  ]

  var foundSkills = commonSkills.filter(function skill { return text.toLowerCase().includes(skill.toLowerCase()); })

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
  var allJobs: any[] = []
  var errors: string[] = []
  var sources: { [key: string]: number } = {}

  console.log('Starting RSS feed scraping...')

  for (var feed of RSS_FEEDS) {
    if (!feed.enabled) {
      console.log("Skipping disabled feed: " + (feed.name) + "")
      sources[feed.name] = 0
      continue
    }

    try {
      console.log("Scraping RSS feed: " + (feed.name) + "")
      
      var response = await axios.get(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        timeout: 15000, // 15 second timeout
        maxRedirects: 5
      })

      var xmlData = await parseXML(response.data) as any
      var items = xmlData?.rss?(.channel == null ? undefined : .channel[0])?.item || xmlData?.feed?.entry || []

      console.log("Found " + (items.length) + " items in " + (feed.name) + "")

      var feedJobCount = 0
      for (var item of items) {
        var job = feed.parser(item)
        if (job && job.title && job.link) {
          // Skip if job is too old (more than 30 days)
          var jobDate = new Date(job.pubDate || Date.now())
          var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          
          if (jobDate < thirtyDaysAgo) {
            continue
          }          // Convert RSS job to database format
          var dbJob = {
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
      console.log("Successfully scraped " + (feedJobCount) + " jobs from " + (feed.name) + "")

    } catch (error: any) {
      var errorMsg = "Error scraping " + (feed.name) + ": " + (error.message) + ""
      console.error(errorMsg)
      errors.push(errorMsg)
      sources[feed.name] = 0
    }
  }

  return {
    success: errors.length < RSS_FEEDS.filter(function f { return f.enabled; }).length, // Success if at least one feed works
    jobs: allJobs,
    errors,
    totalJobs: allJobs.length,
    sources
  }
}

// Function to get enabled RSS feeds (for admin configuration)
function getRSSFeeds(): RSSFeed[] {
  return RSS_FEEDS
}

// Function to update RSS feed configuration
function updateRSSFeedConfig(feedName: string, enabled: boolean): boolean {
  var feed = RSS_FEEDS.find(function f { return f.name === feedName; })
  if (feed) {
    feed.enabled = enabled
    return true
  }
  return false
}
