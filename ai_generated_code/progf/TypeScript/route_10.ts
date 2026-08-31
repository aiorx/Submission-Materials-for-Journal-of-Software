// Aided with basic GitHub coding tools
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

// POST - Bulk approve jobs
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

    const { jobIds } = await request.json()

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid jobIds parameter' },
        { status: 400 }
      )
    }

    // Update jobs to active status
    const { data, error } = await supabase
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
      message: `Successfully approved ${data?.length || 0} jobs`,
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
