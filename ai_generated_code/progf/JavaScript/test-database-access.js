// Supported via standard GitHub programming aids
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseAccess() {
  console.log('Testing database access...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Test 1: Check admin_settings table
    console.log('\n1. Checking admin_settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_key', 'scraping_config')
      .single();
      
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.log('Settings error:', settingsError);
    } else if (settings) {
      console.log('Found settings:', JSON.stringify(settings, null, 2));
    } else {
      console.log('No settings found - will use defaults');
    }
    
    // Test 2: Check admin users
    console.log('\n2. Checking for admin users...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_profiles')
      .select('user_id, is_admin')
      .eq('is_admin', true);
      
    if (adminError) {
      console.log('Admin users error:', adminError);
    } else {
      console.log('Admin users found:', adminUsers?.length || 0);
      if (adminUsers && adminUsers.length > 0) {
        console.log('Admin users:', adminUsers);
      }
    }
    
    // Test 3: Test settings API format transformation
    console.log('\n3. Testing settings format transformation...');
    const testSettings = {
      sources: [
        {
          id: 'test-source',
          name: 'Test Job Board',
          url: 'https://example.com/jobs',
          enabled: true,
          description: 'Test source for verification'
        }
      ],
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
    };
    
    // Transform to database format (like our API does)
    const dbFormat = {
      sources: testSettings.sources.reduce((acc, source) => {
        acc[source.id] = {
          name: source.name,
          url: source.url,
          enabled: source.enabled,
          description: source.description
        };
        return acc;
      }, {}),
      scheduling: {
        enabled: testSettings.schedule.enabled,
        frequency: testSettings.schedule.interval,
        time: testSettings.schedule.time,
        timezone: testSettings.schedule.timezone
      },
      notifications: {
        email: {
          enabled: testSettings.notifications.email,
          address: '',
          on_completion: true,
          on_errors: true
        },
        slack: {
          enabled: testSettings.notifications.slack,
          webhook_url: testSettings.notifications.webhookUrl,
          channel: '#general'
        }
      },
      rate_limits: {
        max_jobs_per_run: testSettings.limits.maxJobsPerRun,
        cooldown_minutes: testSettings.limits.cooldownMinutes,
        requests_per_minute: 30,
        delay_between_requests: 2000,
        max_concurrent: 3
      }
    };
    
    console.log('Database format:', JSON.stringify(dbFormat, null, 2));
    
    // Transform back to frontend format
    const frontendFormat = {
      sources: Object.entries(dbFormat.sources || {}).map(([key, value]) => ({
        id: key,
        name: value.name || key,
        url: value.url || '',
        enabled: value.enabled || false,
        description: value.description || ''
      })),
      schedule: {
        enabled: dbFormat.scheduling?.enabled || false,
        interval: dbFormat.scheduling?.frequency || 'daily',
        time: dbFormat.scheduling?.time || '09:00',
        timezone: dbFormat.scheduling?.timezone || 'UTC'
      },
      notifications: {
        email: dbFormat.notifications?.email?.enabled || false,
        slack: dbFormat.notifications?.slack?.enabled || false,
        webhookUrl: dbFormat.notifications?.slack?.webhook_url || ''
      },
      limits: {
        maxJobsPerRun: dbFormat.rate_limits?.max_jobs_per_run || 100,
        cooldownMinutes: dbFormat.rate_limits?.cooldown_minutes || 60
      }
    };
    
    console.log('Frontend format:', JSON.stringify(frontendFormat, null, 2));
    
    console.log('\n✅ Database access test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabaseAccess();
