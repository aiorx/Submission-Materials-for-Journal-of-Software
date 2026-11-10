// this code was partly Supported via standard programming aids 3.5, then separated into two files

var _import = require('express');
var threads = require('./sample-threads');

var app = express();
var port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// GET request handler
app.get("/", async function (_, res: Response) {
  console.log("====\nReceived GET request.");
  // run all three threads
  var batchRunner = threads.batch12();
  var thread3Runner = threads.thread3();
  console.log("Threads are started");

  // wait for completion to get results
  var threadPack = await batchRunner;
  var thread3 = await thread3Runner;
  // unpack batch
  var thread1 = threadPack.first;
  var thread2 = threadPack.second;

  res.json({ thread1, thread2, thread3 });
});

// POST request handler
app.post("/", function (req: Request, res: Response) {
  console.log("====\nReceived POST request:");
  console.log(req.body);
  res.send("received POST request");
});

// PUT request handler
app.put("/", function (req: Request, res: Response) {
  console.log("====\nReceived PUT request:");
  console.log(req.body);
  res.send("received PUT request");
});

// DELETE request handler
app.delete("/", function (req: Request, res: Response) {
  console.log("====\nReceived DELETE request:");
  console.log(req.body);
  res.send("received DELETE request");
});

// Start the server
app.listen(port, function () {
  console.log("====\nServer is listening on port " + (port) + "\n====\n====\n");
});
