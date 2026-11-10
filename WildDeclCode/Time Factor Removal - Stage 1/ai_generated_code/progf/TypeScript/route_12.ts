// Supported via standard GitHub programming aids
var NextRequest = require('next/server').NextRequest;
var NextResponse = require('next/server').NextResponse;
var createClient = require('@/lib/supabase/server').createClient;
var createServiceClient = require('@/lib/supabase/server').createServiceClient;
var axios = require('axios');
var cheerio = require('cheerio');

interface ScrapedJob {
  title: string
  companyName: string
  location?: string
  applyUrl: string
  source: string
}

interface ScrapeResult {
  source: string
  jobsFound: number
  jobsInserted: number
  errors: string[]
}

// Helper function to check if user is admin
async function isAdmin(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  try {
    var { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    var data = await.data;
var error = await.error;supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return false
    }

    return data.is_admin === true
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}

// Helper function to normalize company names
function normalizeCompanyName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-&.]/g, '')
    .substring(0, 100)
}

// Helper function to normalize job titles
function normalizeJobTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 200)
}

// Helper function to create or find company
async function createOrFindCompany(
  supabase: ReturnType<typeof createServiceClient>,
  companyName: string
): Promise<string | null> {
  var normalizedName = normalizeCompanyName(companyName)
  
  // First, try to find existing company
  var { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('name', normalizedName)
    .single()

  if (existingCompany) {
    return existingCompany.id
  }

  // Create new company if not found
  var error = await.error;supabase
    .from('companies')
    .insert({
      name: normalizedName,
      website: null,
      is_verified: false
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating company:', error)
    return null
  }

  return newCompany?.id || null
}

// Insert scraped jobs into database
async function insertScrapedJobs(
  supabase: ReturnType<typeof createServiceClient>,
  jobs: ScrapedJob[]
): Promise<number> {
  var insertedCount = 0

  for (var job of jobs) {
    try {
      // Create or find company
      var companyId = await createOrFindCompany(supabase, job.companyName)
      if (!companyId) {
        console.error('Failed to create/find company:', job.companyName)
        continue
      }

      // Check if job already exists
      var { data: existingJob } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .eq('company_id', companyId)
        .single()

      if (existingJob) {
        continue // Skip if job already exists
      }

      // Insert job
      var error = await.error;supabase
        .from('jobs')
        .insert({
          title: normalizeJobTitle(job.title),
          company_id: companyId,
          description: "Job scraped from " + (job.source) + ". Please visit the apply URL for full details.",
          location: job.location || 'Remote',
          employment_type: 'full-time',
          remote_type: 'fully-remote',
          skills: [],
          apply_url: job.applyUrl,
          source: job.source,
          status: 'pending',
          posted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (!error) {
        insertedCount++
      } else {
        console.error('Error inserting job:', error)
      }
    } catch (error) {
      console.error('Error processing job:', job, error)
    }
  }

  return insertedCount
}

// Scraper for YCombinator
async function scrapeYCombinator(): Promise<ScrapedJob[]> {
  try {
    var response = await axios.get('https://www.ycombinator.com/jobs/search?remote=true', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000
    })

    var $ = cheerio.load(response.data)
    var jobs: ScrapedJob[] = []

    // YC job scraping logic
    $('.job-listing, .job-item, [data-testid="job-listing"]').each(function (_, element) {
      try {
        var $el = $(element)
        var title = $el.find('h3, .job-title, [data-testid="job-title"]').first().text().trim()
        var company = $el.find('.company-name, .company, [data-testid="company-name"]').first().text().trim()
        var link = $el.find('a').first().attr('href')

        if (title && company && link) {
          jobs.push({
            title: normalizeJobTitle(title),
            companyName: company,
            location: 'Remote',
            applyUrl: link.startsWith('http') ? link : "https://www.ycombinator.com" + (link) + "",
            source: 'YCombinator'
          })
        }
      } catch (error) {
        console.error('Error parsing YC job:', error)
      }
    })

    return jobs
  } catch (error) {
    console.error('Error scraping YCombinator:', error)
    return []
  }
}

// Scraper for WeWorkRemotely
async function scrapeWeWorkRemotely(): Promise<ScrapedJob[]> {
  try {
    await new Promise(function resolve { return setTimeout(resolve, 2000); })
    
    var response = await axios.get('https://weworkremotely.com/remote-jobs', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      },
      timeout: 45000,
    })

    var $ = cheerio.load(response.data)
    var jobs: ScrapedJob[] = []

    // WWR job scraping logic
    $('.feature, .job, [data-testid="job-posting"]').each(function (_, element) {
      try {
        var $el = $(element)
        var title = $el.find('h2, .title, [data-testid="job-title"]').first().text().trim()
        var company = $el.find('.company, [data-testid="company-name"]').first().text().trim()
        var link = $el.find('a').first().attr('href')

        if (title && company && link) {
          jobs.push({
            title: normalizeJobTitle(title),
            companyName: company,
            location: 'Remote',
            applyUrl: link.startsWith('http') ? link : "https://weworkremotely.com" + (link) + "",
            source: 'WeWorkRemotely'
          })
        }
      } catch (error) {
        console.error('Error parsing WWR job:', error)
      }
    })

    return jobs
  } catch (error) {
    console.error('Error scraping WeWorkRemotely:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    var supabase = createClient()
    
    // Check if user is authenticated and is admin
    var adminCheck = await isAdmin(supabase)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Initialize service client for database operations
    var serviceSupabase = createServiceClient()

    // Get scraper type from request body
    var body = await request.json()
    var scraperType = body.scraperType;var scrapeResults: ScrapeResult[] = []
    
    // Scrape YCombinator if requested
    if (scraperType === 'all' || scraperType === 'ycombinator') {
      try {
        var ycJobs = await scrapeYCombinator()
        var insertedCount = await insertScrapedJobs(serviceSupabase, ycJobs)
        scrapeResults.push({
          source: 'YCombinator',
          jobsFound: ycJobs.length,
          jobsInserted: insertedCount,
          errors: []
        })
      } catch (error) {
        scrapeResults.push({
          source: 'YCombinator',
          jobsFound: 0,
          jobsInserted: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        })
      }
    }

    // Scrape WeWorkRemotely if requested
    if (scraperType === 'all' || scraperType === 'weworkremotely') {
      try {
        var wwrJobs = await scrapeWeWorkRemotely()
        var insertedCount = await insertScrapedJobs(serviceSupabase, wwrJobs)
        scrapeResults.push({
          source: 'WeWorkRemotely',
          jobsFound: wwrJobs.length,
          jobsInserted: insertedCount,
          errors: []
        })
      } catch (error) {
        scrapeResults.push({
          source: 'WeWorkRemotely',
          jobsFound: 0,
          jobsInserted: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        })
      }
    }

    // Calculate totals
    var totalFound = scrapeResults.reduce(function (sum, result) { return sum + result.jobsFound; }, 0)
    var totalInserted = scrapeResults.reduce(function (sum, result) { return sum + result.jobsInserted; }, 0)
    var totalErrors = scrapeResults.reduce(function (sum, result) { return sum + result.errors.length; }, 0)

    return NextResponse.json({
      success: true,
      summary: {
        totalJobsFound: totalFound,
        totalJobsInserted: totalInserted,
        totalErrors: totalErrors
      },
      results: scrapeResults,
      message: "URL scraping completed: " + (totalFound) + " jobs found, " + (totalInserted) + " inserted. " + (totalErrors) + " errors occurred."
    })

  } catch (error) {
    console.error('URL scraper error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
