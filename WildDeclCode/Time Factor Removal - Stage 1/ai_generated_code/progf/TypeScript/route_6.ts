// Assisted using common GitHub development utilities
var NextResponse = require('next/server').NextResponse;
var createClient = require('@/lib/supabase/server').createClient;

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

// GET - Load RSS scraping statistics
export async function GET() {
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

    // Get job statistics
    var today = new Date()
    var startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    var startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Jobs scraped today (assuming we had source column)
    var { data: todayJobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact' })
      .gte('created_at', startOfDay.toISOString())

    // Jobs scraped this week
    var { data: weekJobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact' })
      .gte('created_at', startOfWeek.toISOString())

    // Get recent scraping activity (mock data for now)
    var lastScrapeTime = new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago

    var stats = {
      totalFeeds: 4,
      activeFeeds: 3,
      totalJobsToday: todayJobs?.length || 0,
      totalJobsWeek: weekJobs?.length || 0,
      lastScrapeTime,
      scrapingStatus: 'idle'
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('RSS stats fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
