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
            response = await client.get(f"{base_url}/langsmith/status")
            status = response.json()
            print(f"✅ LangSmith Available: {status['available']}")
            print(f"📊 Project: {status['project_name']}")
            if status.get('dashboard_url'):
                print(f"🌐 Dashboard: {status['dashboard_url']}")
        except Exception as e:
            print(f"❌ Status check failed: {e}")
            return
        
        # 2. Make some test requests to generate traces
        print("\n2️⃣ Generating test traces...")
        test_requests = [
            {"text": "Hello AURA!", "session_id": "test-1"},
            {"text": "Open WhatsApp", "session_id": "test-2"},
            {"text": "What's on my screen?", "session_id": "test-3"}
        ]
        
        for i, request in enumerate(test_requests, 1):
            try:
                print(f"   Making request {i}: {request['text']}")
                response = await client.post(
                    f"{base_url}/chat",
                    json=request
                )
                if response.status_code == 200:
                    print(f"   ✅ Success: {response.json()['intent']}")
                else:
                    print(f"   ❌ Failed: {response.status_code}")
            except Exception as e:
                print(f"   ❌ Error: {e}")
        
        # Wait for traces to be processed
        print("\n⏳ Waiting for traces to be processed...")
        await asyncio.sleep(3)
        
        # 3. Check recent traces
        print("\n3️⃣ Retrieving recent traces...")
        try:
            response = await client.get(f"{base_url}/langsmith/traces?hours=1&limit=10")
            if response.status_code == 200:
                traces_data = response.json()
                print(f"✅ Found {traces_data['count']} traces")
                
                if traces_data['traces']:
                    latest_trace = traces_data['traces'][0]
                    print(f"📋 Latest trace: {latest_trace['name']} ({latest_trace['status']})")
                    
                    # 4. Analyze the latest trace
                    print("\n4️⃣ Analyzing latest trace...")
                    trace_id = latest_trace['id']
                    analysis_response = await client.get(f"{base_url}/langsmith/traces/{trace_id}/analysis")
                    
                    if analysis_response.status_code == 200:
                        analysis = analysis_response.json()
                        print(f"📊 Execution Analysis:")
                        print(f"   • Nodes executed: {analysis['total_nodes']}")
                        print(f"   • Total time: {analysis['execution_time_ms']:.1f}ms")
                        print(f"   • Success: {analysis['success']}")
                        print(f"   • Node sequence: {' → '.join(analysis['node_sequence'])}")
                        
                        if analysis['node_execution_times']:
                            print(f"   • Node timings:")
                            for node, time_ms in analysis['node_execution_times'].items():
                                print(f"     - {node}: {time_ms:.1f}ms")
                        
                        if analysis['errors']:
                            print(f"   • Errors: {len(analysis['errors'])}")
                            for error in analysis['errors']:
                                print(f"     - {error['node']}: {error['error']}")
                
            else:
                print(f"❌ Failed to get traces: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Trace retrieval failed: {e}")
        
        # 5. Generate execution report
        print("\n5️⃣ Generating execution report...")
        try:
            response = await client.get(f"{base_url}/langsmith/report?hours=1")
            if response.status_code == 200:
                report = response.json()
                print(f"📈 Execution Report:")
                print(f"   • Total executions: {report['total_executions']}")
                print(f"   • Success rate: {report['success_rate']:.1f}%")
                print(f"   • Average execution time: {report['average_execution_time']:.1f}ms")
                
                if report['most_common_errors']:
                    print(f"   • Common errors:")
                    for error, count in list(report['most_common_errors'].items())[:3]:
                        print(f"     - {error} (x{count})")
            else:
                print(f"❌ Failed to generate report: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Report generation failed: {e}")
        
        # 6. Get dashboard info
        print("\n6️⃣ Getting dashboard information...")
        try:
            response = await client.get(f"{base_url}/langsmith/dashboard")
            if response.status_code == 200:
                dashboard = response.json()
                print(f"🌐 LangSmith Dashboard:")
                print(f"   • URL: {dashboard['dashboard_url']}")
                print(f"   • Project: {dashboard['project_name']}")
                print(f"\n📚 Available endpoints:")
                for name, endpoint in dashboard['available_endpoints'].items():
                    print(f"   • {name}: {endpoint}")
            else:
                print(f"❌ Failed to get dashboard info: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Dashboard info failed: {e}")
    
    print("\n🎉 LangSmith integration test completed!")
    print("\n💡 Next steps:")
    print("1. Get a LangSmith API key from https://smith.langchain.com")
    print("2. Update your .env file with the API key")
    print("3. Restart the server")
    print("4. Run this test again to see full visualization")

if __name__ == "__main__":
    asyncio.run(test_langsmith_integration())
