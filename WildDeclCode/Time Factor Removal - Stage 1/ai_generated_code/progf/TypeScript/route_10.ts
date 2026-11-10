// Aided with basic GitHub coding tools
var NextRequest = require('next/server').NextRequest;
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

// POST - Bulk approve jobs
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

    var jobIds = await.jobIds;request.json()

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid jobIds parameter' },
        { status: 400 }
      )
    }

    // Update jobs to active status
    var data = await.data;
var error = await.error;supabase
      .from('jobs')
      .update({ is_active: true })
      .in('id', jobIds)
      .select()

    if (error) {
      console.error('Error bulk approving jobs:', error)
      return NextResponse.json(
        { error: 'Failed to approve jobs' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully approved " + (data?.length || 0) + " jobs",
      approvedCount: data?.length || 0
    })

  } catch (error) {
    console.error('Bulk approve error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
