"""
Test Copilot Marker Detection
Verifies that the analyzer properly detects "Code Assisted using common GitHub development utilities" comments
"""

from analyzer.accurate_ai_detector import AccurateAIDetector
import json

def test_copilot_marker_detection():
    """Test the enhanced detector with explicit Copilot markers"""
    
    # Load config
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    detector = AccurateAIDetector(config['analysis']['copilot_indicators'])
    
    # Test code with explicit Copilot markers
    code_with_markers = '''
# Code Assisted using common GitHub development utilities
def calculate_user_metrics(users):
    """Calculate metrics for user data"""
    total = len(users)
    active = sum(1 for u in users if u.get('active', False))
    return {'total': total, 'active': active, 'rate': active/total if total > 0 else 0}

# Assisted using common GitHub development utilities  
class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        # Copilot Generated
        return [item for item in self.data if item.get('valid', True)]

# AI-Generated helper function
def validate_email(email):
    return '@' in email and '.' in email.split('@')[1]

# GitHub Copilot suggestion
def format_response(data):
    return {'status': 'success', 'data': data, 'timestamp': '2025-06-09'}
'''
    
    # Test code without markers (for comparison)
    code_without_markers = '''
def calc_stuff(data):
    # quick calc
    cnt = len(data)
    return cnt * 2

class Thing:
    def __init__(self, x):
        self.x = x
    
    def do_work(self):
        return self.x + 1
'''
    
    print("Testing Copilot Marker Detection")
    print("=" * 50)
    
    # Test with markers
    result_with = detector.analyze_content(code_with_markers, '.py')
    print("
Code WITH Copilot markers:")
    print("  Confidence: {:.1%}".format(result_with['confidence_score'])")
    print("  Risk Level: {}".format(result_with['risk_level']))
    print("  Copilot Markers Found: {}".format(len(result_with['copilot_markers'])))
    
    for marker in result_with['copilot_markers']:
        print("    Line {}: {}".format(marker['line_number'], marker['content']))
    
    print("  Explanation: {}".format(result_with['analysis_explanation'][0]))
    
    # Test without markers
    result_without = detector.analyze_content(code_without_markers, '.py')
    print("
Code WITHOUT Copilot markers:")
    print("  Confidence: {:.1%}".format(result_without['confidence_score'])")
    print("  Risk Level: {}".format(result_without['risk_level']))
    print("  Copilot Markers Found: {}".format(len(result_without['copilot_markers'])))
    print("  Explanation: {}".format(result_without['analysis_explanation'][0]))
    
    print("\n" + "=" * 50)
    print("Detection Summary:")
    print("  With markers: {:.1%} confidence".format(result_with['confidence_score'])")
    print("  Without markers: {:.1%} confidence".format(result_without['confidence_score'])")
    print("  Marker boost: +{:.1f} percentage points".format((result_with['confidence_score'] - result_without['confidence_score']) * 100)")

if __name__ == "__main__":
    test_copilot_marker_detection()