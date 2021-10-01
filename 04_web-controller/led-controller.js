const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

exports.light = function(power = false) {
    if (power) {
        LED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        LED.writeSync(0); //set pin state to 0 (turn LED off)
    }
}

exports.isLightning = function() {
    return LED.readSync() === 1;
}

/**
 * Free GPIO resources.
 */
exports.free = function() {
    LED.unexport(); // Unexport LED GPIO to free resources
}
