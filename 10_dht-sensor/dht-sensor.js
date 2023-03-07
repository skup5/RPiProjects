const sensor = require("node-dht-sensor");

const sensorType = 11;
const gpioPin = 4;

sensor.read(sensorType, gpioPin, function(err, temperature, humidity) {
    if (!err) {
        console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
    }
});