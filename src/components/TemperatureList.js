import React from "react";
import "./TemperatureList.scss";

class TemperatureList extends React.Component {
  render() {
    return (
      <div class="bg-dark text-white mt-3 temperature-list">
        <ul>
          {this.props.items.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TemperatureList;
