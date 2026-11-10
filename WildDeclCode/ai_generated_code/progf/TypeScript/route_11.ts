// Supported via standard GitHub programming aids
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)    // Extract query parameters
    const jobTitle = searchParams.get('title') || ''
    const location = searchParams.get('location') || ''
    const employmentType = searchParams.get('type') || ''
    const skills = searchParams.get('skills') || ''
    const salaryMin = searchParams.get('salary_min')
    const salaryMax = searchParams.get('salary_max')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Start building the query - fetch jobs with company data
    let query = supabase
      .from('jobs')
      .select(`
        id,
        title,
        description,
        location,
        salary_min,
        salary_max,
        employment_type,
        remote_type,
        skills,
        apply_url,
        posted_at,
        expires_at,
        companies (
          id,
          name,
          description,
          website,
          logo_url,
          industry,
          size_category,
          location,
          is_verified
        )
      `)
      .eq('is_active', true) // Only fetch active jobs
      .order('posted_at', { ascending: false })

    // Apply filters based on query parameters    // 1. Job title, description, and skills search (case-insensitive)
    if (jobTitle.trim()) {
      // Search in title, description, and also check if any skills match
      query = query.or(`title.ilike.%${jobTitle}%,description.ilike.%${jobTitle}%,skills.cs.{${jobTitle}}`)
    }

    // 2. Location filter (case-insensitive exact match)
    if (location.trim()) {
      query = query.ilike('location', `%${location}%`)
    }

    // 3. Employment type filter (case-insensitive)
    if (employmentType.trim()) {
      query = query.eq('employment_type', employmentType.toLowerCase())
    }

    // 4. Skills filter (search within skills array)
    if (skills.trim()) {
      // Split skills by comma and search for any of them
      const skillsList = skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      if (skillsList.length > 0) {
        // Use overlap operator to check if any skills match
        query = query.overlaps('skills', skillsList)
      }
    }

    // 5. Salary range filter
    if (salaryMin) {
      const minSalary = parseInt(salaryMin)
      if (!isNaN(minSalary)) {
        query = query.gte('salary_max', minSalary)
      }
    }

    if (salaryMax) {
      const maxSalary = parseInt(salaryMax)
      if (!isNaN(maxSalary)) {
        query = query.lte('salary_min', maxSalary)
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute the query
    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs', details: error.message },
        { status: 500 }
      )
    }

    // Get total count for pagination metadata
    const { count: totalCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Transform the data to include company information at the job level
    const transformedJobs = jobs?.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      employment_type: job.employment_type,
      remote_type: job.remote_type,
      skills: job.skills || [],
      apply_url: job.apply_url,
      posted_at: job.posted_at,
      expires_at: job.expires_at,
      company: job.companies
    })) || []

    // Calculate pagination metadata
    const totalPages = Math.ceil((totalCount || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      jobs: transformedJobs,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },      filters: {
        title: jobTitle,
        location,
        type: employmentType,
        skills,
        salary_min: salaryMin,
        salary_max: salaryMax
      }
    })

  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
