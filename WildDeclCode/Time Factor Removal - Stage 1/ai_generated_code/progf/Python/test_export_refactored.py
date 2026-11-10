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
    print("Survey ID: {}".format(survey_id))
    print("-" * 50)
    
    # 1. Test endpoint formati disponibili
    print("1️⃣ Testing export formats endpoint...")
    formats_url = "{}/api/surveys/{}/responses/export/formats".format(base_url, survey_id)
    
    try:
        response = requests.get(formats_url)
        print("   Status: {}".format(response.status_code))
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Formati disponibili: {}".format(len(data['available_formats']))            for fmt in data['available_formats']:
                print("      - {} ({}): {}".format(fmt['name'], fmt['format'], fmt['description']))
        else:
            print("   ❌ Error: {}".format(response.text)            
    except Exception as e:
        print("   ❌ Exception: {}".format(e)    
    print()
    
    # 2. Test endpoint JSON (refactored)
    print("2️⃣ Testing JSON export endpoint...")
    json_url = "{}/api/surveys/{}/responses/export".format(base_url, survey_id)
    
    try:
        response = requests.get(json_url)
        print("   Status: {}".format(response.status_code))
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ JSON Export successful"            print("      - Survey: {}".format(data.get('title')))
            print("      - Responses: {}".format(data.get('total_responses')))
            print("      - Exported at: {}".format(data.get('exported_at')))
            
            # Salva JSON di esempio
            with open('export_test_json.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print("      - Sample saved: export_test_json.json")
            
        else:
            print("   ❌ Error: {}".format(response.text)            
    except Exception as e:
        print("   ❌ Exception: {}".format(e)    
    print()
    
    # 3. Test endpoint CSV (new)
    print("3️⃣ Testing CSV export endpoint...")
    csv_url = "{}/api/surveys/{}/responses/export/csv".format(base_url, survey_id)
    
    try:
        response = requests.get(csv_url)
        print("   Status: {}".format(response.status_code))
        print("   Content-Type: {}".format(response.headers.get('Content-Type')))
        
        if response.status_code == 200:
            print("   ✅ CSV Export successful"            
            # Analizza header Content-Disposition
            content_disp = response.headers.get('Content-Disposition', '')
            if 'filename=' in content_disp:
                filename = content_disp.split('filename=')[1].strip('"')
                print("      - Suggested filename: {}".format(filename))
            
            # Salva CSV di esempio
            csv_content = response.text
            with open('export_test_csv.csv', 'w', encoding='utf-8') as f:
                f.write(csv_content)
            
            # Analizza contenuto CSV
            lines = csv_content.split('\n')
            print("      - CSV lines: {}".format(len(lines)))
            if lines:
                headers = lines[0].split(',')
                print("      - CSV columns: {}".format(len(headers)))
                print("      - Sample saved: export_test_csv.csv")
                
                # Mostra prime 3 righe come esempio
                print("      - CSV preview:")
                for i, line in enumerate(lines[:3]):
                    if line.strip():
                        print("        Row {}: {}{}".format(i+1, line[:80], '...' if len(line) > 80 else ''))
        else:
            print("   ❌ Error: {}".format(response.text)            
    except Exception as e:
        print("   ❌ Exception: {}".format(e)    
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
            print("🧹 Removed: {}".format(file)if __name__ == "__main__":
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
        print("
❌ Unexpected error: {}".format(e)