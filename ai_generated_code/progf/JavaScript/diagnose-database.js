// Assisted using common GitHub development utilities
// Script to check database status and diagnose issues

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Database Diagnostic Tool')
console.log('=' .repeat(50))

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables missing!')
  console.log('Required:')
  console.log('  - NEXT_PUBLIC_SUPABASE_URL')
  console.log('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔗 Supabase URL:', supabaseUrl.substring(0, 30) + '...')
  console.log('🔑 Service Key:', supabaseServiceKey ? 'SET' : 'NOT SET')
  console.log('')

  try {
    // Check connection
    console.log('🏃 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .single()

    if (testError) {
      console.log('❌ Connection test failed:', testError.message)
      console.log('')
      console.log('💡 This usually means:')
      console.log('   1. Database schema not applied yet')
      console.log('   2. Invalid credentials')
      console.log('   3. Tables do not exist')
      console.log('')
      console.log('🔧 Next steps:')
      console.log('   1. Apply schema: Copy supabase/schema.sql to Supabase Dashboard → SQL Editor')
      console.log('   2. Apply admin migration: Copy supabase/admin-migration.sql to SQL Editor')
      return
    }

    console.log('✅ Database connection successful!')
    console.log('')

    // Check tables exist
    console.log('📋 Checking tables...')
    
    const tables = ['companies', 'user_profiles', 'jobs', 'job_applications']
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': ${count} records`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`)
      }
    }

    console.log('')

    // Check admin functionality
    console.log('🔐 Checking admin setup...')
    
    try {
      const { data: adminCheck, error: adminError } = await supabase
        .from('user_profiles')
        .select('user_id, is_admin')
        .eq('is_admin', true)
      
      if (adminError) {
        console.log('❌ Admin check failed:', adminError.message)
        console.log('💡 Admin migration not applied yet')
        console.log('🔧 Apply: supabase/admin-migration.sql')
      } else {
        console.log(`✅ Admin users found: ${adminCheck.length}`)
        if (adminCheck.length === 0) {
          console.log('⚠️  No admin users created yet')
          console.log('🔧 Create admin: Set is_admin = true in user_profiles table')
        }
      }
    } catch (err) {
      console.log('❌ Admin functionality not available:', err.message)
    }

    console.log('')

    // Check pending jobs
    console.log('📋 Checking pending jobs...')
    
    try {
      const { data: pendingJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, is_active')
        .eq('is_active', false)
      
      if (jobsError) {
        console.log('❌ Jobs check failed:', jobsError.message)
      } else {
        console.log(`📊 Pending jobs (is_active = false): ${pendingJobs.length}`)
        console.log(`📊 All jobs: `)
        
        const { count: totalJobs } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
        
        console.log(`📊 Total jobs in database: ${totalJobs}`)
        
        if (pendingJobs.length > 0) {
          console.log('✅ Found pending jobs:')
          pendingJobs.forEach((job, index) => {
            console.log(`   ${index + 1}. ${job.title} (${job.id})`)
          })
        }
      }
    } catch (err) {
      console.log('❌ Jobs check failed:', err.message)
    }

    console.log('')

    // Summary
    console.log('🎯 Summary & Next Steps:')
    console.log('=' .repeat(50))
    
    const { count: companiesCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
    
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
    
    if (companiesCount > 0 && jobsCount > 0) {
      console.log('✅ Database setup looks good!')
      console.log('🔧 If scraper still shows 0 inserted:')
      console.log('   1. Check RLS policies')
      console.log('   2. Verify service role key permissions')
      console.log('   3. Check scraper logs for errors')
    } else {
      console.log('⚠️  Database setup incomplete')
      console.log('🔧 Apply database schemas:')
      console.log('   1. supabase/schema.sql (main tables)')
      console.log('   2. supabase/admin-migration.sql (admin features)')
    }

  } catch (error) {
    console.error('💥 Diagnostic failed:', error.message)
  }
}

checkDatabase()
