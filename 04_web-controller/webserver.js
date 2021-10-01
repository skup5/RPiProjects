const http = require('http').createServer(handler); //require http server, and create server with function handler()
const fs = require('fs'); //require filesystem module
const io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const ledController = require('./led-controller');

const PORT = 8080;

http.listen(PORT, data => {
    console.log('Server is listening on port ' + PORT)
});

function handler(req, res) { //create server
    fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            }); //display 404 on error
            return res.end("404 Not Found");
        }
        res.writeHead(200, {
            'Content-Type': 'text/html'
        }); //write HTML
        res.write(data); //write data from index.html
        return res.end();
    });
}

io.sockets.on('connection', function(socket) { // WebSocket Connection
    let lightvalue = ledController.isLightning(); //static variable for current status

    // send actual LED state to client
    socket.emit('light', lightvalue);

    // get light switch status from client
    socket.on('light', function(data) {
        lightvalue = data;
        console.log(lightvalue);

        // turn LED ON or OFF
        ledController.light(lightvalue);
    });
});

process.on('SIGINT', function() { //on ctrl+c
    ledController.light(false);
    ledController.free();
    process.exit(); //exit completely
});
