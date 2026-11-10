// Supported via standard GitHub programming aids
// Simple test to check admin settings API
var testAdminSettings = async function () {
  try {
    console.log('🧪 Testing admin settings API...')
    
    // First check if we're authenticated
    var debugResponse = await fetch('/api/debug')
    var debugData = await debugResponse.json()
    console.log('🔍 Debug info:', debugData)
    
    if (debugData.authenticated && debugData.isAdmin) {
      console.log('✅ User is authenticated and admin')
      
      // Test settings API
      var settingsResponse = await fetch('/api/admin/settings')
      var settingsData = await settingsResponse.json()
      
      console.log('⚙️ Settings API response:')
      console.log('  Status:', settingsResponse.status)
      console.log('  Success:', settingsData.success)
      console.log('  Sources count:', settingsData.settings?.sources?.length || 0)
      console.log('  Sources:', settingsData.settings?.sources)
      
      return settingsData
    } else {
      console.log('❌ User not authenticated or not admin')
      console.log('  Authenticated:', debugData.authenticated)
      console.log('  Is Admin:', debugData.isAdmin)
      return null
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return null
  }
}

// Auto-run the test
window.addEventListener('load', function () {
  setTimeout(testAdminSettings, 1000)
})

module.exports.testAdminSettings = testAdminSettings;
