import flask
import pyodbc
import kmeans
import config
server = config.server
ddatabase = config.ddatabase
username = config.username
password = config.password
driver = '{ODBC Driver 17 for SQL Server}'
# azure key vault to explored or kubernetes secret
dest = pyodbc.connect('DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;DATABASE=' + ddatabase + ';UID=' + username + ';PWD=' + password)
dcursor = dest.cursor()
app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "<h1>Welcome to Intellipaat Demo</h1><p>This site is a prototype API for moving data between sources. Use /migrate to start the job.</p>"


@app.route('/migrate', methods=['GET'])
def migrate():
    data = kmeans.predict()
# pandas df to use
    for i, row in data.iterrows():
        dcursor.execute("INSERT INTO dbo.Person5 (CustomerID, Amount, Frequency, Recency, ClusterID) Values (?,?,?,?,?)", row.CustomerID, row.Amount, row.Frequency, row.Recency, row.Cluster_Id)
        dest.commit()
    return "<h1>Prediction Done</h1>"


app.run(host='0.0.0.0', port=80)
