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

// GET - Load scraping sources
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

    // Get sources from scraping_sources table
    var { data: sourcesData, error: sourcesError } = await supabase
      .from('scraping_sources')
      .select('id, name, url, enabled, description, priority, last_scraped_at, total_jobs_found, success_rate, created_at, updated_at')
      .order('priority', { ascending: false })

    var sources = []
    
    if (sourcesError || !sourcesData || sourcesData.length === 0) {
      // Return default sources if table doesn't exist or is empty
      sources = [
        {
          id: 'ycombinator',
          name: 'YCombinator Jobs',
          url: 'https://www.ycombinator.com/jobs/search?remote=true',
          enabled: true,
          description: 'Remote jobs from Y Combinator startups'
        },
        {
          id: 'weworkremotely',
          name: 'We Work Remotely',
          url: 'https://weworkremotely.com/remote-jobs',
          enabled: true,
          description: 'Popular remote work job board'
        },
        {
          id: 'remoteok',
          name: 'Remote OK',
          url: 'https://remoteok.io/remote-jobs',
          enabled: false,
          description: 'Tech remote jobs aggregator'
        }
      ]
    } else {
      // Transform database format to frontend format
      sources = sourcesData.map(function (source: any) { return ({
        id: source.id,
        name: source.name,
        url: source.url,
        enabled: source.enabled,
        description: source.description || '',
        priority: source.priority,
        lastScrapedAt: source.last_scraped_at,
        totalJobsFound: source.total_jobs_found,
        successRate: source.success_rate,
        createdAt: source.created_at,
        updatedAt: source.updated_at
      }); })
    }

    return NextResponse.json({
      success: true,
      sources: sources
    })

  } catch (error) {
    console.error('Sources fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST - Add new scraping source
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

    var source = await.source;request.json()

    if (!source || !source.name || !source.url) {
      return NextResponse.json(
        { error: 'Source name and URL are required' },
        { status: 400 }
      )
    }

    // Get current user
    var { data: { user } } = await supabase.auth.getUser()

    // Insert new source into scraping_sources table
    var { data: newSource, error: insertError } = await supabase
      .from('scraping_sources')
      .insert({
        name: source.name,
        url: source.url,
        enabled: source.enabled || false,
        description: source.description || '',
        priority: source.priority || 'medium',
        created_by: user?.id,
        updated_by: user?.id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Source insert error:', insertError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save source' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Source added successfully',
      source: {
        id: newSource.id,
        name: newSource.name,
        url: newSource.url,
        enabled: newSource.enabled,
        description: newSource.description,
        priority: newSource.priority
      }
    })

  } catch (error) {
    console.error('Source add error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PUT - Update scraping source
export async function PUT(request: NextRequest) {
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

    var id = await.id;
var source = await.source;request.json()

    if (!id || !source || !source.name || !source.url) {
      return NextResponse.json(
        { error: 'Source ID, name and URL are required' },
        { status: 400 }
      )
    }

    // Get current user
    var { data: { user } } = await supabase.auth.getUser()

    // Update source in scraping_sources table
    var { data: updatedSource, error: updateError } = await supabase
      .from('scraping_sources')
      .update({
        name: source.name,
        url: source.url,
        enabled: source.enabled,
        description: source.description || '',
        priority: source.priority || 'medium',
        updated_by: user?.id
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Source update error:', updateError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update source' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Source updated successfully',
      source: {
        id: updatedSource.id,
        name: updatedSource.name,
        url: updatedSource.url,
        enabled: updatedSource.enabled,
        description: updatedSource.description,
        priority: updatedSource.priority
      }
    })

  } catch (error) {
    console.error('Source update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete scraping source
export async function DELETE(request: NextRequest) {
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

    var id = await.id;request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Source ID is required' },
        { status: 400 }
      )
    }

    // Delete source from scraping_sources table
    var { error: deleteError } = await supabase
      .from('scraping_sources')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Source delete error:', deleteError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete source' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Source deleted successfully'
    })

  } catch (error) {
    console.error('Source delete error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
