const ds18b20 = require("ds18b20");

/**
 *
 */
class ThermoSensor {


    constructor(){
        this.sensorId[] = {};
    }

    connectSensors() {
    //fetch array containing each ds18b20 sensor's ID
    ds18b20.sensors(function (err, id) {
      console.log("id: " + id);
      if (err) {
        console.error(err);
      } else {
        sensorId.push(id);
  
        // getTemperature();
      }
     });
    }
}
