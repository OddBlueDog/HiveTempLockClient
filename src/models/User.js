const hive = require("../apis/hive");

module.exports = class User {
  constructor(email, password, maxTemp = 21, tempToSet = 21) {
    this.email = email;
    this.password = password;
    this.maxTemp = maxTemp;
    this.tempToSet = tempToSet;
    this.sessionId = null;
    this.deviceList = null;
    this.failedHiveLogin = false;
  }

  async login() {
    try {
      const login = await hive.login(this.email, this.password);
      this.sessionId = login.data.sessions[0].sessionId;
      this.deviceList = await this.getDeviceList();
      this.thermostat = await this.getThermostat();
      this.thermostatId = await this.getThermostatId();
    } catch (e) {
      this.failedHiveLogin = true;
    }
  }

  async getDeviceList() {
    return (await hive.deviceList(this.sessionId)).data.nodes;
  }

  async getThermostat() {
    const themostat = this.deviceList.filter(function(node) {
      return node.name.match(/Thermostat *(.+)*/g) && node.attributes.temperature;
    });

    return themostat;
  }

  async setTargetTemp(temperature) {
    return hive.setTargetTemp(this.sessionId, this.thermostatId, temperature);
  }

  getThermostatId() {
    return this.thermostat[0].id;
  }

  getCurrentTargetTemp() {
    return this.thermostat[0].attributes.targetHeatTemperature.targetValue;
  }
};
