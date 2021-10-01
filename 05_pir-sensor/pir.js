const gpio = require("onoff").Gpio;
const rpiApi = require("../rpi-api/rpi-api");

const pir = new gpio(4, "in", "both");
const led = new rpiApi.ledController.LedController(17);

function watchPir() {
  pir.watch(function (err, value) {
    if (err) console.log(err);

    console.log("value: " + value);
    let motion = false;
    if (value == 1) {
      console.log("Intruder alert");
      motion = true;
    } else {
      console.log("Intruder gone");
    }
    led.light(motion);
  });
}

function exit() {
  console.log("Exiting");
  pir.unexport();
  led.light(false);
  led.free();

  process.exit();
}

function main() {
  process.on("SIGINT", exit);

  watchPir();

  console.log("Monitoring...");
}

main();
