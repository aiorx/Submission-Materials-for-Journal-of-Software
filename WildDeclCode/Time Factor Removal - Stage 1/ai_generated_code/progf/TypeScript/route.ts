// Supported via standard GitHub programming aids
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

    // Get various statistics
    var [
      totalJobsResult,
      activeJobsResult,
      pendingJobsResult,
      companiesResult,
      verifiedCompaniesResult,
      recentJobsResult
    ] = await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('is_active', false),
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabase.from('jobs').select('created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ])    // Calculate jobs per day over last 7 days
    var jobsPerDay = recentJobsResult.data?.reduce(function (acc: Record<string, number>, job: { created_at: string }) {
      var date = new Date(job.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {}) || {}

    var stats = {
      overview: {
        totalJobs: totalJobsResult.count || 0,
        activeJobs: activeJobsResult.count || 0,
        pendingJobs: pendingJobsResult.count || 0,
        totalCompanies: companiesResult.count || 0,
        verifiedCompanies: verifiedCompaniesResult.count || 0
      },
      trends: {
        jobsLast7Days: recentJobsResult.data?.length || 0,
        dailyBreakdown: jobsPerDay
      },
      health: {
        approvalRate: totalJobsResult.count ? 
          Math.round(((activeJobsResult.count || 0) / totalJobsResult.count) * 100) : 0,
        pendingReview: pendingJobsResult.count || 0
      }
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
