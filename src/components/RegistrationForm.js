import React from "react";
import * as backend from "./../apis/backend";

class RegistrationForm extends React.Component {
  state = {
    email: "",
    password: "",
    maxTemp: null,
    tempToSet: null,
    formMessage: null,
    formSuccess: true,
    agreedPrivacy: false,
    loading: false
  };

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
    this.createUser();
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

    if (!this.state.agreedPrivacy) {
      this.setState({
        formMessage: "You must agree to the privacy policy to use this service.",
        formSuccess: false,
        loading: false
      });

      return false;
    }

    return true;
  }

  createUser = async () => {
    if (!this.validateForm()) return;

    try {
      const result = await backend.createUser(this.state);
      this.setState({
        formMessage: result.data.message,
        formSuccess: true,
        loading: false
      });
    } catch (e) {
      let message = e.response ? e.response.data.message : "Service is down. Failed to connect to backend.";
      this.setState({
        formMessage: message,
        formSuccess: false,
        loading: false
      });
    }
  };

  render() {
    return (
      <div className="jumbotron">
        <h1 class="display-4">Hive Temperature Lock</h1>
        <p class="lead">
          This utility checks if your all hive thermostats (you can have multiple thermostats on an account) current target temperatures exceeds your max target temperature.
          If it does exceed your max target temperature then the target temperature is set to the temperature you have
          specified. For any questions please contact me: thomas01155@gmail.com 
          <strong>Note: Temperature is only checked once every 5 mins.</strong>
        </p>
        <p><strong>This app is not compatible with 2FA (two factor authentication)</strong></p>
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
              Beware: your password is stored in plain text. You should change your Hive account password to something
              random and unique before using this service.
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
              <option value="25.5">25.5</option>
              <option value="26.0">26.0</option>
              <option value="26.5">26.5</option>
              <option value="27.7">26.0</option>
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
              <option value="25">25</option>
            </select>
            <small id="tempToSetHelp" className="form-text text-muted">
              This is the tempeature to set the thermostat to if the max target temperature is exceeded.
            </small>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="agreedPrivacy"
              id="agreedPrivacy"
              checked={this.state.agreedPrivacy}
              onChange={this.onInputChange}
            />
            <label class="form-check-label" for="agree">
              By ticking this box you agree that your password will be stored as plain text and agree to the privacy
              policy.
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={this.state.loading}>
            Submit
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
        <p className="mt-3 alert alert-warning">
          Disclaimer: This service is currently a work in progress and is in beta. This service comes with absolutely no
          warranty, please use at your own risk. If you don't wish for your password to be stored as plain text then
          please do not use this service. You may instead wish to use the server code and host it yourself for security
          reasons. You can also try the local version but the browser must remain open when in use.
        </p>
        <p className="mt-3 alert alert-info">
          Please note, this will also turn off schedule and boost, turning it back to manual if it exceeds your maximum
          temperature.
        </p>
      </div>
    );
  }
}

export default RegistrationForm;
