const http = require('http').createServer(handler); //require http server, and create server with function handler()
const fs = require('fs'); //require filesystem module
const io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const Led = require('./led-controller').Led;


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

function main() {
    const PORT = 8080;
    const WHITE = 'light1';
    const GREEN = 'light2';
    const BLUE = 'light3';

    const leds = {};
    leds[WHITE] = new Led(4);
    leds[GREEN] = new Led(17);

    io.sockets.on('connection', function(socket) { // WebSocket Connection

        // send actual LED state to client
        // socket.emit('light', lightvalue);

        // get light switch status from client
        socket.on('light', function(data) {
            console.log('received: ' + JSON.stringify(data));

            if (leds.hasOwnProperty(data.ledId)) {
                const led = leds[data.ledId];
                // turn LED ON or OFF
                led.light(data.light);
            }
        });
    });

    process.on('SIGINT', function() { //on ctrl+c
        for (var key in leds) {
            leds[key].light(false);
            leds[key].free();
        }

        process.exit(); //exit completely
    });

    http.listen(PORT, data => {
        console.log('Server is listening on port ' + PORT)
    });
}

main();
