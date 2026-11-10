// Supported via standard GitHub programming aids
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Helper function to check if user is admin
async function isAdmin(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return false
    }

    const { data, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError || !data) {
      return false
    }

    return data.is_admin === true
  } catch {
    return false
  }
}

interface RouteParams {
  params: {
    id: string
  }
}

// PATCH endpoint to approve a job
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()
    const jobId = params.id

    // Validate job ID
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Check if user is authenticated and is admin
    const adminCheck = await isAdmin(supabase)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Update job to set is_active = true
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .eq('is_active', false) // Only update if currently inactive
      .select()
      .single()

    if (error) {
      console.error('Error approving job:', error)
      return NextResponse.json(
        { error: 'Failed to approve job' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Job not found or already approved' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Job approved successfully',
      job: data
    })

  } catch (error) {
    console.error('Approve job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to reject/delete a job
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()
    const jobId = params.id

    // Validate job ID
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Check if user is authenticated and is admin
    const adminCheck = await isAdmin(supabase)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Delete the job
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('is_active', false) // Only delete if currently inactive

    if (error) {
      console.error('Error rejecting job:', error)
      return NextResponse.json(
        { error: 'Failed to reject job' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Job rejected and deleted successfully'
    })

  } catch (error) {
    console.error('Reject job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
