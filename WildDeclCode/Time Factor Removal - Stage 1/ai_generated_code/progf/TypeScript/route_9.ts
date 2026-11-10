// Aided with basic GitHub coding tools
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

// GET - Load pending jobs for review
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

    // Get pending jobs (is_active = false)
    var error = await.error;supabase
      .from('jobs')
      .select("
        id,
        title,
        location,
        posted_at,
        is_active,
        companies (
          name
        )
      ")
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching pending jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pending jobs' },
        { status: 500 }
      )
    }    // Transform data for the frontend
    var transformedJobs = jobs?.map(function job {
      var companyName = 'Unknown Company'
      if (job.companies) {
        if (Array.isArray(job.companies) && job.companies.length > 0) {
          companyName = (job.companies[0] as any)?.name || 'Unknown Company'
        } else {
          companyName = (job.companies as any)?.name || 'Unknown Company'
        }
      }
      
      return {
        id: job.id,
        title: job.title,
        company: companyName,
        location: job.location,
        source: 'RSS', // Default since source column might not exist yet
        posted_at: job.posted_at,
        is_active: job.is_active
      }
    }) || []

    return NextResponse.json({
      success: true,
      jobs: transformedJobs
    })

  } catch (error) {
    console.error('Pending jobs fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
