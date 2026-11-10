# Aided with basic GitHub coding tools
"""
Test script to demonstrate AURA agent LangSmith visualization
"""

import asyncio
import httpx
import json
from typing import Dict, Any

async def test_langsmith_integration():
    """Test LangSmith integration with AURA agent"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing AURA Agent LangSmith Integration")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        # 1. Check LangSmith status
        print("\n1️⃣ Checking LangSmith status...")
        try:
            response = await client.get("{}/langsmith/status".format(base_url))
            status = response.json()
            print("✅ LangSmith Available: {}".format(status['available'])            print("📊 Project: {}".format(status['project_name'])           if status.get('dashboard_url'):
                print("🌐 Dashboard: {}".format(status['dashboard_url'])       except Exception as e:
            print("❌ Status check failed: {}".format(e)            return
        
        # 2. Make some test requests to generate traces
        print("\n2️⃣ Generating test traces...")
        test_requests = [
            {"text": "Hello AURA!", "session_id": "test-1"},
            {"text": "Open WhatsApp", "session_id": "test-2"},
            {"text": "What's on my screen?", "session_id": "test-3"}
        ]
        
        for i, request in enumerate(test_requests, 1):
            try:
                print("   Making request {}: {}".format(i, request['text']))
                response = await client.post(
                    "{}/chat".format(base_url),
                    json=request
                )
                if response.status_code == 200:
                    print("   ✅ Success: {}".format(response.json()['intent'])                else:
                    print("   ❌ Failed: {}".format(response.status_code)            except Exception as e:
                print("   ❌ Error: {}".format(e)        
        # Wait for traces to be processed
        print("\n⏳ Waiting for traces to be processed...")
        await asyncio.sleep(3)
        
        # 3. Check recent traces
        print("\n3️⃣ Retrieving recent traces...")
        try:
            response = await client.get("{}/langsmith/traces?hours=1&limit=10".format(base_url))
            if response.status_code == 200:
                traces_data = response.json()
                print("✅ Found {} traces".format(traces_data['count'])                
                if traces_data['traces']:
                    latest_trace = traces_data['traces'][0]
                    print("📋 Latest trace: {} ({})".format(latest_trace['name'], latest_trace['status'])                   
                    # 4. Analyze the latest trace
                    print("\n4️⃣ Analyzing latest trace...")
                    trace_id = latest_trace['id']
                    analysis_response = await client.get("{}/langsmith/traces/{}/analysis".format(base_url, trace_id))
                    
                    if analysis_response.status_code == 200:
                        analysis = analysis_response.json()
                        print("📊 Execution Analysis:"                       print("   • Nodes executed: {}".format(analysis['total_nodes'])                        print("   • Total time: {:.1f}ms".format(analysis['execution_time_ms'])
                        print("   • Success: {}".format(analysis['success'])                        print("   • Node sequence: {}".format(' → '.join(analysis['node_sequence']))                      
                        if analysis['node_execution_times']:
                            print("   • Node timings:"                            for node, time_ms in analysis['node_execution_times'].items():
                                print("     - {}: {:.1f}ms".format(node, time_ms)")
                        
                        if analysis['errors']:
                            print("   • Errors: {}".format(len(analysis['errors']))                            for error in analysis['errors']:
                                print("     - {}: {}".format(error['node'], error['error']))
                
            else:
                print("❌ Failed to get traces: {}".format(response.status_code)                
        except Exception as e:
            print("❌ Trace retrieval failed: {}".format(e)        
        # 5. Generate execution report
        print("\n5️⃣ Generating execution report...")
        try:
            response = await client.get("{}/langsmith/report?hours=1".format(base_url))
            if response.status_code == 200:
                report = response.json()
                print("📈 Execution Report:"               print("   • Total executions: {}".format(report['total_executions'])                print("   • Success rate: {:.1f}%".format(report['success_rate'])
                print("   • Average execution time: {:.1f}ms".format(report['average_execution_time'])
                
                if report['most_common_errors']:
                    print("   • Common errors:"                    for error, count in list(report['most_common_errors'].items())[:3]:
                        print("     - {} (x{})".format(error, count))
            else:
                print("❌ Failed to generate report: {}".format(response.status_code)                
        except Exception as e:
            print("❌ Report generation failed: {}".format(e)        
        # 6. Get dashboard info
        print("\n6️⃣ Getting dashboard information...")
        try:
            response = await client.get("{}/langsmith/dashboard".format(base_url))
            if response.status_code == 200:
                dashboard = response.json()
                print("🌐 LangSmith Dashboard:"               print("   • URL: {}".format(dashboard['dashboard_url'])                print("   • Project: {}".format(dashboard['project_name'])                print("
📚 Available endpoints:"               for name, endpoint in dashboard['available_endpoints'].items():
                    print("   • {}: {}".format(name, endpoint)            else:
                print("❌ Failed to get dashboard info: {}".format(response.status_code)                
        except Exception as e:
            print("❌ Dashboard info failed: {}".format(e)    
    print("\n🎉 LangSmith integration test completed!")
    print("\n💡 Next steps:")
    print("1. Get a LangSmith API key from https://smith.langchain.com")
    print("2. Update your .env file with the API key")
    print("3. Restart the server")
    print("4. Run this test again to see full visualization")

if __name__ == "__main__":
    asyncio.run(test_langsmith_integration())
