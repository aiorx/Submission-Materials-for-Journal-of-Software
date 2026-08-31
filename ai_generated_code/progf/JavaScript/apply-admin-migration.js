// Aided with basic GitHub coding tools
// CommonJS Script to apply the admin migration to Supabase

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔐 Starting Admin Migration...')
console.log('URL configured:', !!supabaseUrl)
console.log('Service key configured:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  
  // Let's try to provide helpful information
  console.log('\n📋 Your .env.local should contain:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyAdminMigration() {
  console.log('🔐 Applying Admin Migration to Supabase...\n')

  try {
    // Read the admin migration file
    const migrationPath = path.join(__dirname, 'supabase', 'admin-migration.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      process.exit(1)
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📖 Reading migration from:', migrationPath)
    console.log('📏 Migration size:', migrationSQL.length, 'characters\n')

    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log('📝 Found', statements.length, 'SQL statements to execute\n')

    let successCount = 0
    let errorCount = 0
    const errors = []

    // Execute each statement directly using SQL
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip empty statements
      if (!statement || statement.length < 5) {
        continue
      }

      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
      console.log(`📄 SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`)
      
      try {
        // Execute the SQL directly
        const { data, error } = await supabase
          .from('pg_stat_activity') // Use any table to execute raw SQL via RPC
          .select('*')
          .limit(0)
        
        // Actually, let's try to execute via raw SQL using the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql: statement })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Error in statement ${i + 1}:`, errorText)
          errors.push({ statement: i + 1, error: errorText, sql: statement })
          errorCount++
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message)
        errors.push({ statement: i + 1, error: err.message, sql: statement })
        errorCount++
      }
      
      console.log('') // Add spacing
    }

    // Summary
    console.log('📊 Migration Summary:')
    console.log(`✅ Successful statements: ${successCount}`)
    console.log(`❌ Failed statements: ${errorCount}`)
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      errors.forEach((error, index) => {
        console.log(`\n${index + 1}. Statement ${error.statement}:`)
        console.log(`   Error: ${error.error}`)
        console.log(`   SQL: ${error.sql.substring(0, 200)}${error.sql.length > 200 ? '...' : ''}`)
      })
      
      console.log('\n💡 Note: Some errors may be expected (e.g., "already exists" errors)')
      console.log('💡 If you see "column already exists" or "function already exists", that\'s normal')
    } else {
      console.log('\n🎉 Admin migration completed successfully!')
    }
    
    console.log('\n📋 Next steps:')
    console.log('1. Go to your Supabase dashboard → Authentication → Users')
    console.log('2. Find your user and note the User ID')
    console.log('3. Go to Table Editor → user_profiles')
    console.log('4. Find your user profile and set is_admin = true')
    console.log('5. Test the admin dashboard at http://localhost:3000/admin/review')

  } catch (error) {
    console.error('💥 Fatal error applying admin migration:', error)
    process.exit(1)
  }
}

// Run the migration
applyAdminMigration().catch(console.error)
