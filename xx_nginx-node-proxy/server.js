// Server setup
const PORT = 3000;
const ADDRESS = "0.0.0.0";
const CONTEXT_PATH = "/RPiProject/";

// Websocket
const interval = 1000;

// External dependencies
const fs = require("fs"); //require filesystem module
const express = require("express");
const router = express.Router();
const app = express();

// Context-forwarding function
router
  .route("/") // Bind root (Equals to CONTEXT_PATH )
  .all((req, res) => {
    // Forward any request, no matter POST,GET etc...
    console.log("Forwarding to handler");
    handler(req, res);
  });

// Bind server
let http = app.use(CONTEXT_PATH, router).listen(PORT, ADDRESS, (data) => {
  console.log(`Server is listening on ${ADDRESS}:${PORT}${CONTEXT_PATH}`);
});

const io = require("socket.io")(http, { path: `${CONTEXT_PATH}` }); //require socket.io module and pass the http object (server)

function handler(req, res) {
  //create server
  fs.readFile(__dirname + "/public/index.html", function (err, data) {
    //read file index.html in public folder
    if (err) {
      res.writeHead(404, {
        "Content-Type": "text/html",
      }); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {
      "Content-Type": "text/html",
    }); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

//when a client connects
io.sockets.on("connection", function (socket) {
  console.log("client " + socket + " was connected");

  //initiate interval timer
  setInterval(function () {
    const time = Date();
    console.log("time: " + time);
    socket.emit("time", time);
  }, interval);
});
