const http = require("http").createServer(handler); //require http server, and create server with function handler()
const fs = require("fs"); //require filesystem module
const io = require("socket.io")(http); //require socket.io module and pass the http object (server)
const ds18b20 = require("ds18b20");

const interval = 3000; //enter the time between sensor queries here (in milliseconds)
const PORT = 8080;

http.listen(PORT, (data) => {
  console.log("Server is listening on port " + PORT);
});

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
  var sensorId = [];
  //fetch array containing each ds18b20 sensor's ID
  ds18b20.sensors(function (err, id) {
    console.log("id: " + id);
    if (err) {
      console.error(err);
    } else {
      sensorId.push(id);
      socket.emit("sensors", id); //send sensor ID's to clients

      // getTemperature();
    }
  });

  //initiate interval timer
  setInterval(function () {
    //loop through each sensor id
    sensorId.forEach(function (id) {
      console.log("forEach value: " + id);

      ds18b20.temperature(id, function (err, value) {
        //send temperature reading out to connected clients T(°C)
        var sendMe = value + " C";
        socket.emit("temps", { id: id, value: sendMe });
        console.log("Teplota: " + sendMe);
      });
    });
  }, interval);
});

function getTemperatureSync() {
  var id;
  if (sensorId.length > 0) id = sensorId[0];
  else {
    console.log("none sensor id");
    return;
  }
  // ... or sync call
  console.log("Teplota: " + ds18b20.temperatureSync(id));
}
