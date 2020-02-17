import React from "react";
import * as hive from "./../apis/hive";
import TemperatureList from "./TemperatureList";

class LocalForm extends React.Component {
  state = {
    email: "",
    password: "",
    maxTemp: null,
    tempToSet: null,
    formMessage: null,
    formSuccess: true,
    agreedPrivacy: false,
    loading: false,
    sessionId: null,
    deviceList: null,
    failedHiveLogin: false,
    thermostatId: null,
    timer: 30000,
    items: []
  };

  async getDeviceList(sessionId) {
    return (await hive.deviceList(sessionId)).data.nodes;
  }

  async getThermostat(deviceList) {
    const themostat = deviceList.filter(function(node) {
      return node.name.match(/Thermostat *(.+)*/g) && node.attributes.temperature;
    });

    return themostat;
  }

  async setTargetTemp(temperature) {
    return hive.setTargetTemp(this.state.sessionId, this.state.thermostatId, temperature);
  }

  getThermostatId(thermostat) {
    return thermostat[0].id;
  }

  getCurrentTargetTemp(thermostat) {
    return thermostat[0].attributes.targetHeatTemperature.targetValue;
  }

  getCurrentReportedValue(thermostat) {
    return thermostat[0].attributes.targetHeatTemperature.reportedValue;
  }

  onInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    this.login();
    setInterval(this.temperatureCheckLoop, this.state.timer);
  };

  temperatureCheckLoop = async () => {
    if (!this.state.thermostatId || !this.state.sessionId) return;

    const deviceList = await this.getDeviceList(this.state.sessionId);
    const thermostat = await this.getThermostat(deviceList);
    const thermostatId = await this.getThermostatId(thermostat);

    const currentTemp = this.getCurrentTargetTemp(thermostat);
    const currentReportedTemp = this.getCurrentReportedValue(thermostat);

    const newItem = {
      deviceList: deviceList,
      thermostat: thermostat,
      thermostatId: thermostatId,
      text: `Current target temperature is ${currentTemp} or ${currentReportedTemp}`,
      id: Date.now()
    };

    this.setState({
      items: this.state.items.concat(newItem)
    });

    if (currentTemp > this.state.maxTemp || currentReportedTemp > this.state.maxTemp) {
      const newItem = {
        text: `Current target temperature of ${currentTemp} or reported tempearture of ${currentReportedTemp} is above max target temperature of ${
          this.state.maxTemp
        } Now setting target temperature to ${this.state.tempToSet}`,
        id: Date.now()
      };

      await this.setTargetTemp(this.state.tempToSet);

      this.setState({
        items: this.state.items.concat(newItem)
      });
    }

    if (this.state.items.length > 20) {
      this.setState({
        items: this.state.items.slice(1)
      });
    }
  };

  login = async () => {
    try {
      const login = await hive.login(this.state.email, this.state.password);
      const sessionId = login.data.sessions[0].sessionId;
      const deviceList = await this.getDeviceList(sessionId);
      const thermostat = await this.getThermostat(deviceList);
      const thermostatId = await this.getThermostatId(thermostat);

      const newItem = {
        text: "Login sucessful",
        id: Date.now()
      };

      this.setState({
        sessionId: sessionId,
        deviceList: deviceList,
        thermostatId: thermostatId,
        loading: false,
        items: this.state.items.concat(newItem)
      });

      this.temperatureCheckLoop();
    } catch (e) {
      switch (e) {
        case "USERNAME_PASSWORD_ERROR":
          console.log("username or password wrong");
          break;
        default:
          console.log("failed to login");
      }

      const newItem = {
        text: `Login Failed, please check password and email`,
        id: Date.now()
      };

      this.setState({
        loading: false,
        items: this.state.items.concat(newItem)
      });
    }
  };

  validateForm() {
    if (!this.state.email || !this.state.password || !this.state.maxTemp || !this.state.tempToSet) {
      this.setState({
        formMessage: "Please fill in all fields",
        formSuccess: false,
        loading: false
      });

      return false;
    }

    if (this.state.maxTemp <= this.state.tempToSet) {
      this.setState({
        formMessage: "Max target temperature should be greater than temperature to set",
        formSuccess: false,
        loading: false
      });

      return false;
    }

    return true;
  }

  render() {
    return (
      <div className="jumbotron">
        <h1 class="display-4">Hive Temperature Lock</h1>
        <p class="lead">
          This utility checks if your hive thermostats current target temperature exceeds your max target temperature.
          If it does exceed your max target temperature then the temperature is set to the temperature you have
          specified. This is the local version, your details are not transmitted to this services backend, only to Hives
          api. <strong>Note: Temperature is checked every 30 seconds.</strong>
        </p>
        <div className="alert bg-success text-white">
          This version is likely safer than the server based version of this service as your password is only
          transmitted to the Hive API rather than the backend servers of this service. However you must keep the browser
          open at all times while it is running.
        </div>
        <form onSubmit={this.onFormSubmit}>
          <div className="form-group">
            <label for="email">Hive Email</label>
            <input
              className="form-control"
              type="text"
              placeholder="Hive Email"
              value={this.state.email}
              onChange={this.onInputChange}
              name="email"
            />
          </div>
          <div className="form-group">
            <label for="password">Hive Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Hive Password"
              value={this.state.password}
              onChange={this.onInputChange}
              name="password"
            />
            <small id="passwordHelp" class="form-text text-muted">
              Your password is not transmitted to this services servers only to Hive apis.
            </small>
          </div>
          <div className="form-group">
            <label for="maxTemp">Max Target Tempearture</label>
            <select
              className="custom-select"
              id="inputGroupSelect01"
              value={this.state.maxTemp}
              onChange={this.onInputChange}
              name="maxTemp"
            >
              <option selected>Choose...</option>
              <option value="20">20</option>
              <option value="20.5">20.5</option>
              <option value="21">21</option>
              <option value="21.5">21.5</option>
              <option value="22">22</option>
              <option value="22.5">22.5</option>
              <option value="23">23</option>
              <option value="23.5">23.5</option>
              <option value="24">24</option>
              <option value="24.5">24.5</option>
              <option value="25">25</option>
            </select>
            <small id="maxTempHelp" class="form-text text-muted">
              This is the maximum target temperature you ever want your hive thermostat to be set at before the
              temperature is changed to the value below.
            </small>
          </div>
          <div className="form-group">
            <label for="tempToSet">Temperature to set</label>
            <select
              className="custom-select"
              id="inputGroupSelect01"
              value={this.state.tempToSet}
              onChange={this.onInputChange}
              name="tempToSet"
            >
              <option selected>Choose...</option>
              <option value="20">20</option>
              <option value="20.5">20.5</option>
              <option value="21">21</option>
              <option value="21.5">21.5</option>
              <option value="22">22</option>
              <option value="22.5">22.5</option>
              <option value="23">23</option>
              <option value="23.5">23.5</option>
              <option value="24">24</option>
              <option value="24.5">24.5</option>
              <option value="25.0">25</option>
            </select>
            <small id="tempToSetHelp" className="form-text text-muted">
              This is the tempeature to set the thermostat to if the max target temperature is exceeded.
            </small>
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={this.state.loading}>
            Start
          </button>
        </form>
        {this.state.loading && (
          <div class="spinner-border text-primary mt-3" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        )}
        {this.state.formMessage && (
          <div className={`alert mb-0 mt-3 ${this.state.formSuccess ? "alert-success" : "alert-danger"}`}>
            {this.state.formMessage}
          </div>
        )}
        <TemperatureList items={this.state.items} />

        <p className="mt-3 alert alert-warning">
          Disclaimer: This service is currently a work in progress and is in beta. This service comes with absolutely no
          warranty, please use at your own risk.
        </p>
        <p className="mt-3 alert alert-info">
          Please note, this will also turn off schedule and boost, turning it back to manual if it exceeds your maximum
          temperature.
        </p>
      </div>
    );
  }
}

export default LocalForm;
