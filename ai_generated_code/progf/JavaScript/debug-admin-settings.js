// Assisted using common GitHub development utilities
// Debug the admin_settings table structure

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function debugAdminSettings() {
  console.log('Debugging admin_settings table...')
  
  // Create admin client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // Check current admin settings
    console.log('\n1. Current admin_settings:')
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('*')

    if (settingsError) {
      console.error('Error fetching admin settings:', settingsError)
    } else {
      console.log('Count:', settings.length)
      settings.forEach((setting, index) => {
        console.log(`${index + 1}. Key: ${setting.setting_key}`)
        console.log('   Created:', setting.created_at)
        console.log('   Updated:', setting.updated_at)
      })
    }

    // Try to test the upsert operation
    console.log('\n2. Testing upsert operation...')
    
    const testSettings = {
      scheduling: {
        enabled: false,
        frequency: 'daily',
        time: '09:00',
        timezone: 'UTC'
      },
      notifications: {
        email: {
          enabled: false,
          address: '',
          on_completion: true,
          on_errors: true
        },
        slack: {
          enabled: false,
          webhook_url: '',
          channel: '#general'
        }
      },
      rate_limits: {
        max_jobs_per_run: 100,
        cooldown_minutes: 60,
        requests_per_minute: 30,
        delay_between_requests: 2000,
        max_concurrent: 3
      }
    }

    // Try different upsert approaches
    console.log('Trying upsert with onConflict...')
    const { data: upsertData, error: upsertError } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'scraping_config',
        setting_value: testSettings,
        updated_by: null
      }, {
        onConflict: 'setting_key'
      })
      .select()

    if (upsertError) {
      console.error('Upsert with onConflict failed:', upsertError)
      
      // Try update instead
      console.log('Trying update instead...')
      const { data: updateData, error: updateError } = await supabase
        .from('admin_settings')
        .update({
          setting_value: testSettings,
          updated_by: null,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'scraping_config')
        .select()

      if (updateError) {
        console.error('Update failed:', updateError)
      } else {
        console.log('Update successful:', updateData)
      }
    } else {
      console.log('Upsert successful:', upsertData)
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

debugAdminSettings()
