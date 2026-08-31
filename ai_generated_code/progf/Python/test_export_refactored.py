#!/usr/bin/env python3
"""
Script di test per i nuovi endpoint di export (JSON e CSV)
Testa il refactoring della funzionalità di esportazione
Assisted using common GitHub development utilities
"""

import requests
import json
import os

def test_export_endpoints():
    """Testa tutti gli endpoint di export"""
    base_url = "http://127.0.0.1:5001"
    survey_id = 2  # ID del questionario di test
    
    print("🧪 Testing export functionality refactoring...")
    print(f"Survey ID: {survey_id}")
    print("-" * 50)
    
    # 1. Test endpoint formati disponibili
    print("1️⃣ Testing export formats endpoint...")
    formats_url = f"{base_url}/api/surveys/{survey_id}/responses/export/formats"
    
    try:
        response = requests.get(formats_url)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Formati disponibili: {len(data['available_formats'])}")
            for fmt in data['available_formats']:
                print(f"      - {fmt['name']} ({fmt['format']}): {fmt['description']}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print()
    
    # 2. Test endpoint JSON (refactored)
    print("2️⃣ Testing JSON export endpoint...")
    json_url = f"{base_url}/api/surveys/{survey_id}/responses/export"
    
    try:
        response = requests.get(json_url)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ JSON Export successful")
            print(f"      - Survey: {data.get('title')}")
            print(f"      - Responses: {data.get('total_responses')}")
            print(f"      - Exported at: {data.get('exported_at')}")
            
            # Salva JSON di esempio
            with open('export_test_json.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"      - Sample saved: export_test_json.json")
            
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print()
    
    # 3. Test endpoint CSV (new)
    print("3️⃣ Testing CSV export endpoint...")
    csv_url = f"{base_url}/api/surveys/{survey_id}/responses/export/csv"
    
    try:
        response = requests.get(csv_url)
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('Content-Type')}")
        
        if response.status_code == 200:
            print(f"   ✅ CSV Export successful")
            
            # Analizza header Content-Disposition
            content_disp = response.headers.get('Content-Disposition', '')
            if 'filename=' in content_disp:
                filename = content_disp.split('filename=')[1].strip('"')
                print(f"      - Suggested filename: {filename}")
            
            # Salva CSV di esempio
            csv_content = response.text
            with open('export_test_csv.csv', 'w', encoding='utf-8') as f:
                f.write(csv_content)
            
            # Analizza contenuto CSV
            lines = csv_content.split('\n')
            print(f"      - CSV lines: {len(lines)}")
            if lines:
                headers = lines[0].split(',')
                print(f"      - CSV columns: {len(headers)}")
                print(f"      - Sample saved: export_test_csv.csv")
                
                # Mostra prime 3 righe come esempio
                print(f"      - CSV preview:")
                for i, line in enumerate(lines[:3]):
                    if line.strip():
                        print(f"        Row {i+1}: {line[:80]}{'...' if len(line) > 80 else ''}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print()
    print("🎯 Test Summary:")
    print("- Export formats endpoint: New feature")
    print("- JSON export: Refactored with utility functions")  
    print("- CSV export: New format support")
    print("- Frontend: Enhanced with format selection modal")

def cleanup_test_files():
    """Rimuove i file di test generati"""
    test_files = ['export_test_json.json', 'export_test_csv.csv']
    for file in test_files:
        if os.path.exists(file):
            os.remove(file)
            print(f"🧹 Removed: {file}")

if __name__ == "__main__":
    try:
        test_export_endpoints()
        
        # Chiedi se rimuovere i file di test
        response = input("\n🗑️  Remove test files? (y/N): ")
        if response.lower() == 'y':
            cleanup_test_files()
        else:
            print("📁 Test files kept for inspection")
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
