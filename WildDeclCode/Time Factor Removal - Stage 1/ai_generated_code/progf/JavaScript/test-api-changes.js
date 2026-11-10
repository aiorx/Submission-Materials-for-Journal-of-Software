// Assisted using common GitHub development utilities
// Test script to verify the updated scraping sources API
var https = require('https');

async function testScrapingSourcesAPI() {
  try {
    console.log('Testing scraping sources API...');
    
    // Test GET request to admin settings
    var response = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      var data = await response.json();
      console.log('✅ API Response Status:', response.status);
      console.log('✅ Response Data:', JSON.stringify(data, null, 2));
      
      if (data.settings && data.settings.sources) {
        console.log('\n📊 Sources found:');
        data.settings.sources.forEach(function (source, index) {
          console.log("" + (index + 1) + ". " + (source.name) + ": " + (source.url) + " (" + (source.enabled ? 'enabled' : 'disabled') + ")");
        });
      }
    } else {
      console.log('❌ API Response Status:', response.status);
      var errorData = await response.text();
      console.log('❌ Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testScrapingSourcesAPI();
