// Supported via standard GitHub programming aids
// Test admin settings with authentication

async function testAdminSettingsWithAuth() {
  console.log('Testing admin settings with proper authentication...')

  try {
    // First, get the current settings
    console.log('1. Getting current settings...')
    const getResponse = await fetch('http://localhost:3001/api/admin/settings', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const getData = await getResponse.json()
    console.log('GET Response status:', getResponse.status)
    console.log('GET Response:', JSON.stringify(getData, null, 2))

    if (!getData.success) {
      console.log('Authentication issue - cannot test POST without valid session')
      return
    }

    // Modify one source's enabled status
    const modifiedSettings = { ...getData.settings }
    if (modifiedSettings.sources && modifiedSettings.sources.length > 0) {
      modifiedSettings.sources[0].enabled = !modifiedSettings.sources[0].enabled
      console.log('Modified first source enabled status to:', modifiedSettings.sources[0].enabled)
    }

    // Test POST
    console.log('\n2. Testing POST with modified settings...')
    const postResponse = await fetch('http://localhost:3001/api/admin/settings', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ settings: modifiedSettings })
    })

    const postData = await postResponse.json()
    console.log('POST Response status:', postResponse.status)
    console.log('POST Response:', JSON.stringify(postData, null, 2))

    // Verify the change
    console.log('\n3. Verifying the change...')
    const verifyResponse = await fetch('http://localhost:3001/api/admin/settings', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const verifyData = await verifyResponse.json()
    if (verifyData.success && verifyData.settings.sources) {
      console.log('Verification - first source enabled:', verifyData.settings.sources[0]?.enabled)
    }

  } catch (error) {
    console.error('Test error:', error)
  }
}

// Run in browser console
testAdminSettingsWithAuth()
