// Aided with basic GitHub coding tools
import { NextResponse } from 'next/server'
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

export async function POST() {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated and is admin
    const adminCheck = await isAdmin(supabase)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }    // Make internal request to scraper API with admin authorization
    const scraperResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'your-secure-secret-key-here-change-this-in-production'}`,
        'Content-Type': 'application/json'
      }
    })

    if (!scraperResponse.ok) {
      const error = await scraperResponse.text()
      return NextResponse.json(
        { 
          success: false, 
          error: 'Scraper failed',
          details: error 
        },
        { status: 500 }
      )
    }

    const scraperData = await scraperResponse.json()

    return NextResponse.json({
      success: true,
      summary: scraperData.summary,
      results: scraperData.results,
      message: scraperData.message
    })

  } catch (error) {
    console.error('Admin scraper error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
