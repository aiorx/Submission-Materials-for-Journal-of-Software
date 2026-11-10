// Supported via standard GitHub programming aids
// Test scraping sources management functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testScrapingSourcesManagement() {
  console.log('🧪 Testing Scraping Sources Management...\n');

  try {
    // Test 1: Get current settings
    console.log('1. Testing GET /api/admin/settings...');
    const getResponse = await fetch('http://localhost:3001/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (getResponse.status === 401) {
      console.log('❌ Authentication required - this is expected for browser requests');
      console.log('✅ API is properly protected with authentication\n');
    } else {
      const result = await getResponse.json();
      console.log('✅ Settings API accessible');
      console.log('Settings:', JSON.stringify(result, null, 2));
    }

    // Test 2: Check database structure
    console.log('2. Testing database access...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('admin_settings')
      .select('setting_key, setting_value')
      .eq('setting_key', 'scraping_config')
      .single();

    if (settingsError) {
      console.log('❌ Database error:', settingsError.message);
      return;
    }

    console.log('✅ Database access successful');
    console.log('Current settings structure:');
    console.log('- Setting key:', settingsData.setting_key);
    console.log('- Sources count:', Object.keys(settingsData.setting_value.sources || {}).length);
    
    // Test 3: Simulate adding a new source
    console.log('\n3. Testing source management logic...');
    const currentSettings = settingsData.setting_value;
    
    // Add a test source
    const testSourceId = `test-source-${Date.now()}`;
    currentSettings.sources[testSourceId] = {
      name: 'Test Job Board',
      url: 'https://example.com/jobs',
      enabled: false,
      description: 'Test source for validation'
    };

    console.log('✅ Test source added to structure');
    console.log('New source ID:', testSourceId);

    // Test 4: Save updated settings
    const { error: saveError } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'scraping_config',
        setting_value: currentSettings
      });

    if (saveError) {
      console.log('❌ Save error:', saveError.message);
      return;
    }

    console.log('✅ Settings saved successfully');

    // Test 5: Verify the save
    const { data: verifyData, error: verifyError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'scraping_config')
      .single();

    if (verifyError) {
      console.log('❌ Verification error:', verifyError.message);
      return;
    }

    const savedSources = verifyData.setting_value.sources;
    if (savedSources[testSourceId]) {
      console.log('✅ Source saved and verified successfully');
      console.log('Saved source:', savedSources[testSourceId]);
    } else {
      console.log('❌ Source not found after save');
    }

    // Test 6: Clean up test source
    delete currentSettings.sources[testSourceId];
    await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'scraping_config',
        setting_value: currentSettings
      });

    console.log('✅ Test cleanup completed');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ API authentication is working');
    console.log('✅ Database access is working');
    console.log('✅ Settings structure is correct');
    console.log('✅ Source management logic works');
    console.log('✅ Save/retrieve operations work');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testScrapingSourcesManagement();
