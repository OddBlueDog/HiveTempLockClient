import React from "react";

const ChangeLog = () => {
  return (
    <div className="jumbotron">
      <p>12th Ocotober 2020</p>
      <ul>
        <li>Updated login api, app should be working again</li>
      </ul>
      <p>17th Febuary 2020</p>
      <ul>
        <li>Explanded lower range to 20 and upper range to 25</li>
      </ul>
        <p>16th Febuary 2020</p>
      <ul>
        <li>Added support for multiple thermostats (server version only, local coming soon)<a href="https://github.com/OddBlueDog/HiveTempLockServer/commit/e1d165e7fb56a6a9563cb061cd79de7e5f8ec230">Git</a></li>
      </ul>
    </div>
  );
};

export default ChangeLog;
