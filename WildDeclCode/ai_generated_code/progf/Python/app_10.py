# The below was Assisted using common GitHub development utilities.
import Flask, request, jsonify

app = Flask(__name__)

# Currently Aspiringing to create a small web app that can build a form for you, but Out Of Scope for now.
@app.route('/')
def index():
    return '''
    <!doctype html>
    <title>Upload CSV</title>
    <h1>Upload CSV File</h1>
    <form action="/upload" method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        df = pd.read_csv(file)
        return df.to_html()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
