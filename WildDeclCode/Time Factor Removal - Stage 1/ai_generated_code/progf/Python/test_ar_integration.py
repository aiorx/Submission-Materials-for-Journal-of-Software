# Supported via standard GitHub programming aids
"""
Test script for AR Toggle and JSON Server Integration
Tests the complete flow from frontend toggle to backend server control
"""

import requests
import time
import json

# Configuration
BASE_URL = "http://localhost:5000"
TEST_ENDPOINTS = {
    "start_server": "{}/start_json_server".format(BASE_URL),
    "stop_server": "{}/stop_json_server".format(BASE_URL), 
    "check_status": "{}/check_json_server_status".format(BASE_URL),
    "visualization": "{}/visualization".format(BASE_URL)
}

def test_server_endpoints():
    """Test all AR server control endpoints"""
    print("🧪 Testing AR Server Integration\n")
    
    # Test 1: Check initial status
    print("1️⃣ Testing server status check...")
    try:
        response = requests.get(TEST_ENDPOINTS["check_status"])
        if response.status_code == 200:
            status = response.json()
            print("   ✅ Status endpoint working: {}".format(status)        else:
            print("   ❌ Status check failed: {}".format(response.status_code)    except Exception as e:
        print("   ❌ Status check error: {}".format(e)    
    # Test 2: Start server
    print("\n2️⃣ Testing server start...")
    try:
        response = requests.post(TEST_ENDPOINTS["start_server"])
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("   ✅ Server started: {}".format(result.get('url'))            else:
                print("   ❌ Start failed: {}".format(result.get('error'))        else:
            print("   ❌ Start request failed: {}".format(response.status_code)    except Exception as e:
        print("   ❌ Start error: {}".format(e)    
    # Test 3: Wait and check status
    print("\n3️⃣ Waiting 3 seconds and checking status...")
    time.sleep(3)
    try:
        response = requests.get(TEST_ENDPOINTS["check_status"])
        if response.status_code == 200:
            status = response.json()
            print("   ✅ Server status: {}".format(status)            
            # Test 4: Try to access the AR server URL if available
            if status.get('status') == 'online' and status.get('url'):
                print("
4️⃣ Testing AR server URL access..."              try:
                    ar_response = requests.get(status['url'], timeout=5)
                    if ar_response.status_code == 200:
                        data = ar_response.json()
                        print("   ✅ AR server responding with data: {} characters".format(len(str(data)))                    else:
                        print("   ⚠️ AR server returned status: {}".format(ar_response.status_code)              except Exception as e:
                    print("   ❌ AR server access error: {}".format(e)        else:
            print("   ❌ Status check failed: {}".format(response.status_code)    except Exception as e:
        print("   ❌ Status check error: {}".format(e)    
    # Test 5: Stop server
    print("\n5️⃣ Testing server stop...")
    try:
        response = requests.post(TEST_ENDPOINTS["stop_server"])
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("   ✅ Server stopped successfully"            else:
                print("   ❌ Stop failed: {}".format(result.get('error'))        else:
            print("   ❌ Stop request failed: {}".format(response.status_code)    except Exception as e:
        print("   ❌ Stop error: {}".format(e)
def test_visualization_page():
    """Test if the visualization page loads correctly"""
    print("\n6️⃣ Testing visualization page...")
    try:
        response = requests.get(TEST_ENDPOINTS["visualization"])
        if response.status_code == 200:
            content = response.text
            # Check for AR toggle elements
            ar_elements = [
                'view-ar',
                'view-3d', 
                'ar-server-controls',
                'start-ar-server',
                'stop-ar-server'
            ]
            
            missing_elements = []
            for element in ar_elements:
                if element not in content:
                    missing_elements.append(element)
            
            if not missing_elements:
                print("   ✅ All AR toggle elements found in page")
            else:
                print("   ⚠️ Missing elements: {}".format(missing_elements)      else:
            print("   ❌ Visualization page failed: {}".format(response.status_code)    except Exception as e:
        print("   ❌ Visualization page error: {}".format(e)
def main():
    """Main test function"""
    print("=" * 60)
    print("🚀 AR TOGGLE & JSON SERVER INTEGRATION TEST")
    print("=" * 60)
    
    # Check if Flask app is running
    try:
        response = requests.get("{}/health".format(BASE_URL), timeout=5)
        if response.status_code == 200:
            print("✅ Flask application is running\n")
        else:
            print("❌ Flask application health check failed")
            return
    except Exception as e:
        print("❌ Flask application not accessible: {}".format(e)        print("   💡 Make sure to run: python app_modular.py")
        return
    
    # Run tests
    test_server_endpoints()
    test_visualization_page()
    
    print("\n" + "=" * 60)
    print("🎉 TESTING COMPLETE!")
    print("=" * 60)
    
    print("\n📋 Manual Testing Steps:")
    print("1. Open: http://localhost:5000/visualization")
    print("2. Click the 'AR View' toggle button")
    print("3. Verify AR server controls appear")
    print("4. Click 'Start Server' and check status")
    print("5. Copy the URL and test in Unity/AR app")
    print("6. Click 'Stop Server' to cleanup")

if __name__ == "__main__":
    main()
