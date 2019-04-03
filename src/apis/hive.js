const axios = require("axios");

const baseApi = axios.create({
  baseURL: "https://api-prod.bgchprod.info:443/omnia",
  headers: {
    "Content-Type": "application/vnd.alertme.zoo-6.1+json",
    Accept: "application/vnd.alertme.zoo-6.1+json",
    "X-Omnia-Client": "Hive Web Dashboard"
  }
});

export async function login(username, password) {
  return await baseApi.post("/auth/sessions", {
    sessions: [
      {
        username: username,
        password: password,
        caller: "WEB"
      }
    ]
  });
}

export async function deviceList(sessionId) {
  return await baseApi.get("/nodes", {
    headers: {
      "X-Omnia-Access-Token": sessionId
    }
  });
}

export async function setTargetTemp(sessionId, deviceId, temperature) {
  return await baseApi.put(
    `/nodes/${deviceId}`,
    {
      nodes: [
        {
          attributes: {
            targetHeatTemperature: {
              targetValue: temperature
            }
          }
        }
      ]
    },
    {
      headers: {
        "X-Omnia-Access-Token": sessionId
      }
    }
  );
}
