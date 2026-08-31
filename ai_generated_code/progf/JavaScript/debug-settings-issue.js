// Aided with basic GitHub coding tools
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function debugSettingsIssue() {
  console.log('🔍 Debugging scraping sources display issue...\n');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Step 1: Check what's in the admin_settings table
    console.log('1. Checking admin_settings table...');
    const { data: allSettings, error: allError } = await supabase
      .from('admin_settings')
      .select('*');
      
    if (allError) {
      console.log('❌ Error fetching all settings:', allError);
    } else {
      console.log(`✅ Found ${allSettings?.length || 0} settings records:`);
      allSettings?.forEach((setting, index) => {
        console.log(`   ${index + 1}. Key: ${setting.setting_key}`);
        console.log(`      Value: ${JSON.stringify(setting.setting_value, null, 2)}`);
        console.log(`      Updated: ${setting.updated_at}`);
        console.log('');
      });
    }
    
    // Step 2: Check specifically for scraping_config
    console.log('\n2. Checking scraping_config specifically...');
    const { data: scrapingConfig, error: configError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_key', 'scraping_config')
      .single();
      
    if (configError) {
      if (configError.code === 'PGRST116') {
        console.log('⚠️  No scraping_config found - this is why sources aren\'t loading!');
      } else {
        console.log('❌ Error fetching scraping config:', configError);
      }
    } else {
      console.log('✅ Found scraping_config:');
      console.log(JSON.stringify(scrapingConfig.setting_value, null, 2));
    }
    
    // Step 3: Simulate the API transformation
    console.log('\n3. Testing API data transformation...');
    
    if (scrapingConfig && scrapingConfig.setting_value) {
      const dbSettings = scrapingConfig.setting_value;
      
      // This is the transformation our API does
      const frontendSettings = {
        sources: Object.entries(dbSettings.sources || {}).map(([key, value]) => ({
          id: key,
          name: value.name || key,
          url: value.url || '',
          enabled: value.enabled || false,
          description: value.description || ''
        })),
        schedule: {
          enabled: dbSettings.scheduling?.enabled || false,
          interval: dbSettings.scheduling?.frequency || 'daily',
          time: dbSettings.scheduling?.time || '09:00',
          timezone: dbSettings.scheduling?.timezone || 'UTC'
        },
        notifications: {
          email: dbSettings.notifications?.email?.enabled || false,
          slack: dbSettings.notifications?.slack?.enabled || false,
          webhookUrl: dbSettings.notifications?.slack?.webhook_url || ''
        },
        limits: {
          maxJobsPerRun: dbSettings.rate_limits?.max_jobs_per_run || 100,
          cooldownMinutes: dbSettings.rate_limits?.cooldown_minutes || 60
        }
      };
      
      console.log('✅ Transformed frontend settings:');
      console.log(JSON.stringify(frontendSettings, null, 2));
      
      console.log(`\n🔍 Sources found: ${frontendSettings.sources.length}`);
      frontendSettings.sources.forEach((source, index) => {
        console.log(`   ${index + 1}. ${source.name}: ${source.url} (${source.enabled ? 'enabled' : 'disabled'})`);
      });
    }
    
    // Step 4: Check if we have default sources being used
    console.log('\n4. Testing default sources fallback...');
    const defaultSources = [
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
        id: 'google',
        name: 'Google Careers',
        url: 'https://careers.google.com/jobs/results/',
        enabled: true,
        description: 'Google job postings with remote options'
      }
    ];
    
    console.log('Default sources that should be shown:', defaultSources.length);
    defaultSources.forEach((source, index) => {
      console.log(`   ${index + 1}. ${source.name}: ${source.url}`);
    });
    
    console.log('\n🔍 Analysis complete!');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

debugSettingsIssue();
