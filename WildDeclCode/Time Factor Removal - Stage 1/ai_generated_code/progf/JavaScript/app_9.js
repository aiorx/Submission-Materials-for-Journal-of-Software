/*
  This JavaScript file contains code generated with assistance Referenced via basic programming materials,
  an AI language model developed by OpenAI.

  ChatGPT was used for advice on certain functionalities and structures in
  this project.

  For more information, visit: https://openai.com/chatgpt
*/

var http = require("http");
var url = require("url");
var mysql = require("mysql2/promise");

var dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "your_new_password",
  database: "patientDB",
};

var ALLOWED_ORIGINS = [
  "https://comp5437lab05.netlify.app",
  "https://potipress.com",
];

var pool = mysql.createPool(dbConfig);

// Initialize the database
async function initializeDatabase() {
  try {
    var connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(
      "CREATE DATABASE IF NOT EXISTS " + (dbConfig.database) + ""
    );
    await connection.query("USE " + (dbConfig.database) + "");
    await connection.query("
        CREATE TABLE IF NOT EXISTS patients (
        patientID INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL
        ) ENGINE=InnoDB
    ");
    console.log("Database and table initialized successfully");
    await connection.end();
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Create the server
var server = http.createServer(async function (req, res) {
  var origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Add CORS headers to all responses
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  var method = req.method;
  var parsedUrl = url.parse(req.url, true);
  var pathname = parsedUrl.pathname;

  if (pathname.startsWith("/lab5/api/")) {
    if (method == "GET") {
      await handleGETRequest(req, res);
    } else if (method == "POST") {
      await handlePOSTRequest(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message:
            "This method is not allowed. Only 'GET' and 'POST' methods are allowed.",
        })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

function isAllowedQuery(query) {
  var lowerQuery = query.toLowerCase().trim();
  return lowerQuery.startsWith("select") || lowerQuery.startsWith("insert");
}

async function handleGETRequest(req, res) {
  try {
    var parsedUrl = url.parse(req.url, true);
    var sqlQuery = decodeURIComponent(
      parsedUrl.pathname.slice("/lab5/api/".length)
    );

    if (!isAllowedQuery(sqlQuery)) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message:
            "Query not allowed. Only SELECT and INSERT queries are permitted.",
        })
      );
    }

    var connection = await pool.getConnection();
    try {
      var [results] = await connection.execute(sqlQuery);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ results }));
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "An error occurred while executing the query.",
      })
    );
  }
}

async function handlePOSTRequest(req, res) {
  var body = "";
  req.on("data", function (chunk) {
    body += chunk.toString();
  });
  req.on("end", async function () {
    try {
      var params = JSON.parse.params;(body);
      console.log("Received params:", params);

      var connection = await pool.getConnection();
      try {
        var placeholders = params.map(() => "(?, ?)").join(", ");
        var sql = "INSERT INTO patients (name, dateOfBirth) VALUES " + (placeholders) + "";

        if (!isAllowedQuery(sql)) {
          res.writeHead(403, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              message:
                "Query not allowed. Only INSERT queries are permitted for POST requests.",
            })
          );
        }

        var flattenedParams = params.flat();
        console.log(flattenedParams);
        var [results] = await connection.execute(sql, flattenedParams);

        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({ message: "Patient added successfully", results })
        );
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "An error occurred while executing the query.",
        })
      );
    }
  });
}

initializeDatabase().then(function () {
  var PORT = process.env.PORT || 3555;
  server.listen(PORT, () => {
    console.log("Server running on port https://potipress.com:" + (PORT) + "");
  });
});
