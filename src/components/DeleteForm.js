import React from "react";
import * as backend from "./../apis/backend";

class DeleteForm extends React.Component {
  state = {
    email: "",
    password: "",
    formMessage: null,
    formSuccess: true
  };
  onInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.deleteUser();
  };

  validateForm() {
    if (!this.state.email || !this.state.password) {
      this.setState({
        formMessage: "Please fill in all fields",
        formSuccess: false
      });

      return false;
    }

    return true;
  }

  deleteUser = async () => {
    if (!this.validateForm()) return;

    try {
      const result = await backend.deleteUser(this.state);
      this.setState({
        formMessage: result.data.message,
        formSuccess: true
      });
    } catch (e) {
      this.setState({
        formMessage: e.response.data.message,
        formSuccess: false
      });
    }
  };

  render() {
    return (
      <div className="jumbotron">
        <h1 class="display-4">Hive Temperature Lock - Delete</h1>
        <p class="lead">
          Please input the details you used initially when using this app to create a temperature lock.
        </p>
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
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
        {this.state.formMessage && (
          <div className={`alert mb-0 mt-3 ${this.state.formSuccess ? "alert-success" : "alert-danger"}`}>
            {this.state.formMessage}
          </div>
        )}
      </div>
    );
  }
}

export default DeleteForm;
