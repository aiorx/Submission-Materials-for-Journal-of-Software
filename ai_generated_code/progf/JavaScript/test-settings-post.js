// Assisted using common GitHub development utilities
// Test admin settings POST with actual data structure

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSettingsPost() {
  console.log('Testing admin settings POST endpoint...')
  
  // Create admin client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // Get current sources from database
    const { data: currentSources, error: sourceError } = await supabase
      .from('scraping_sources')
      .select('*')

    if (sourceError) {
      console.error('Error fetching sources:', sourceError)
      return
    }

    console.log('Current sources:', currentSources.length)

    // Create test settings payload that would be sent from the frontend
    const testSettings = {
      sources: currentSources.map(source => ({
        id: source.id,
        name: source.name,
        url: source.url,
        enabled: !source.enabled, // Toggle enabled status
        description: source.description || ''
      })),
      schedule: {
        enabled: false,
        interval: 'daily',
        time: '09:00',
        timezone: 'UTC'
      },
      notifications: {
        email: false,
        slack: false,
        webhookUrl: ''
      },
      limits: {
        maxJobsPerRun: 100,
        cooldownMinutes: 60
      }
    }

    console.log('Test settings payload structure:')
    console.log('- Sources count:', testSettings.sources.length)
    console.log('- First source enabled:', testSettings.sources[0]?.enabled)
    console.log('- Source IDs:', testSettings.sources.map(s => s.id))

    // Simulate the POST request logic
    console.log('\nSimulating POST logic...')
    
    // Check existing sources logic
    const { data: existingSources } = await supabase
      .from('scraping_sources')
      .select('id, name')

    const existingIds = existingSources?.map(s => s.id) || []
    const newSourceIds = testSettings.sources.map(s => s.id).filter(id => typeof id === 'string' && id.length > 0)

    console.log('Existing IDs:', existingIds)
    console.log('New source IDs:', newSourceIds)

    // Check sources to delete
    const sourcesToDelete = existingIds.filter(id => !newSourceIds.includes(id))
    console.log('Sources to delete:', sourcesToDelete)

    // Test each source update
    for (const source of testSettings.sources) {
      console.log(`\nTesting source: ${source.name}`)
      console.log('- ID:', source.id)
      console.log('- Enabled:', source.enabled)
      console.log('- Exists in DB:', existingIds.includes(source.id))

      if (source.id && existingIds.includes(source.id)) {
        console.log('- Action: UPDATE')
        
        const sourceData = {
          name: source.name,
          url: source.url,
          enabled: source.enabled || false,
          description: source.description || '',
          updated_by: null // no user ID for this test
        }

        const { data: updateResult, error: updateError } = await supabase
          .from('scraping_sources')
          .update(sourceData)
          .eq('id', source.id)
          .select()

        if (updateError) {
          console.error('- Update ERROR:', updateError)
        } else {
          console.log('- Update SUCCESS')
          console.log('- New enabled status:', updateResult[0]?.enabled)
        }
      } else {
        console.log('- Action: INSERT (new source)')
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testSettingsPost()
