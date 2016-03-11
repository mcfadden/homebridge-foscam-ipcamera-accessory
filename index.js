var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-foscam-ipcamera", "FoscamIPCamera", FoscamIPCameraAccessory);
}

function FoscamIPCameraAccessory(log, config) {
  this.log = log;

  // url info
  this.ip_address  = config["ip_address"];
  this.username    = config["username"];
  this.password    = config["password"];
  this.name        = config["name"];
  this.hd_api      = config["hd_api"]
}

FoscamIPCameraAccessory.prototype = {

  httpRequest: function(url, method, callback) {
    request({
      url: url,
      method: method
    },
    function (error, response, body) {
      callback(error, response, body)
    })
  },

  positionToFoscamCommand: function(position){
    // 1 == 31
    // 16 == 61
    
    if(position <= 0 || position > 16){
      return 0;
    }else{
      // Magic Foscam Formula
      return (position * 2) + 29;
    }
  },

  setTargetPosition: function(targetPosition, callback){
    this.log("setTargetPosition");

    commandCode = this.positionToFoscamCommand(targetPosition)
    
    if(commandCode == 0){
      this.log("Invalid TargetPosition " + targetPosition)
      callback(null, targetPosition);
      return;
    }

    if(this.hd_api){
      this.log("Using HD Camera API")
      url = "http://" + this.ip_address + "/cgi-bin/CGIProxy.fcgi?cmd=ptzGotoPresetPoint&name=" + targetPosition + "&usr=" + this.username + "&pwd=" + this.password
    }else{
      url = "http://" + this.ip_address + "/decoder_control.cgi?command=" + commandCode + "&user=" + this.username + "&pwd=" + this.password
    }

    this.httpRequest(url, "GET", function(error, response, data) {
      if (error) {
        this.log('setTargetPosition: %s', error);
        callback(error);
      }
      else {
        this.log('setTargetPosition succeeded!');
        callback(null, targetPosition);
      }
    }.bind(this));
  },
  
  getTargetPosition: function(callback) {
    // Foscam cameras don't return the current position via the API
    callback(null, 100);
  },
  
  getCurrentPosition: function(callback) {
    // Foscam cameras don't return the current position via the API
    callback(null, 100);
  },
  
  getPositionState: function(callback) {
    // Foscam cameras don't return the current position via the API
    callback(null, Characteristic.PositionState.STOPPED);
  },

  getName: function(callback) {
    this.log("getName");

    callback(null, this.name);
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Foscam")
      .setCharacteristic(Characteristic.Model, "FI8918W")
      .setCharacteristic(Characteristic.SerialNumber, "?");

    var cameraService = new Service.WindowCovering(this.name);
    
    cameraService.getCharacteristic( Characteristic.CurrentPosition ).on( 'get', this.getCurrentPosition.bind(this) );
    
    cameraService.getCharacteristic( Characteristic.TargetPosition ).on( 'get', this.getTargetPosition.bind(this) );
    cameraService.getCharacteristic( Characteristic.TargetPosition ).on( 'set', this.setTargetPosition.bind(this) );
    
    cameraService.getCharacteristic( Characteristic.PositionState ).on( 'get', this.getPositionState.bind(this) );
    
    return [informationService, cameraService];
  }
};