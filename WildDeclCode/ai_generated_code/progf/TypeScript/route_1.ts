// Assisted using common GitHub development utilities
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { scrapeRSSFeeds } from '@/lib/scrapers/rss-scraper'

// Helper function to check if user is admin
async function isAdmin(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data, error } = await supabase
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

// Helper function to insert RSS job
async function insertRSSJob(
  supabase: ReturnType<typeof createServiceClient>,
  job: any
): Promise<boolean> {
  try {
    // Create or find company
    let companyId = null
    if (job.company) {
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('name', job.company)
        .single()

      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        const { data: newCompany } = await supabase
          .from('companies')
          .insert({
            name: job.company,
            website: null,
            is_verified: false
          })
          .select('id')
          .single()

        companyId = newCompany?.id
      }
    }

    if (!companyId) {
      console.error('Failed to create/find company for RSS job:', job.company)
      return false
    }

    // Check if job already exists
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('id')
      .eq('title', job.title)
      .eq('company_id', companyId)
      .single()

    if (existingJob) {
      return false // Job already exists
    }

    // Insert job
    const { error } = await supabase
      .from('jobs')
      .insert({
        title: job.title.substring(0, 200),
        company_id: companyId,
        description: job.description?.substring(0, 5000) || 'No description available',
        location: job.location || 'Remote',
        employment_type: job.employment_type || 'full-time',
        remote_type: job.remote_type || 'fully-remote',
        skills: job.skills || [],
        salary_text: job.salary_text,
        apply_url: job.apply_url,
        source: job.source || 'RSS Feed',
        status: 'pending',
        posted_at: job.posted_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error inserting RSS job:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error processing RSS job:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated and is admin
    const adminCheck = await isAdmin(supabase)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Initialize service client for database operations
    const serviceSupabase = createServiceClient()

    // Scrape RSS Feeds
    try {
      console.log('Starting RSS feed scraping...')
      const rssResults = await scrapeRSSFeeds()
      
      // Insert RSS jobs using the RSS-specific format
      let totalRSSInserted = 0
      for (const job of rssResults.jobs) {
        try {
          const result = await insertRSSJob(serviceSupabase, job)
          if (result) totalRSSInserted++
        } catch (error) {
          console.error('Error inserting RSS job:', error)
        }
      }

      const scrapeResults = [{
        source: 'RSS Feeds',
        jobsFound: rssResults.totalJobs,
        jobsInserted: totalRSSInserted,
        errors: rssResults.errors
      }]

      // Add individual RSS source results
      for (const [sourceName, count] of Object.entries(rssResults.sources)) {
        if (count > 0) {
          scrapeResults.push({
            source: `RSS: ${sourceName}`,
            jobsFound: count,
            jobsInserted: Math.floor(count * (totalRSSInserted / rssResults.totalJobs)), // Proportional estimate
            errors: []
          })
        }
      }

      console.log(`RSS scraping completed: ${rssResults.totalJobs} jobs found, ${totalRSSInserted} inserted`)

      return NextResponse.json({
        success: true,
        summary: {
          totalJobsFound: rssResults.totalJobs,
          totalJobsInserted: totalRSSInserted,
          totalErrors: rssResults.errors.length
        },
        results: scrapeResults,
        message: `RSS scraping completed: ${rssResults.totalJobs} jobs found, ${totalRSSInserted} inserted. ${rssResults.errors.length} errors occurred.`
      })

    } catch (error) {
      console.error('RSS scraping failed:', error)
      return NextResponse.json({
        success: false,
        error: 'RSS scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('RSS scraper error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
