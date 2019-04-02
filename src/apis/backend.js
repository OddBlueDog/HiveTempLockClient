const axios = require("axios");

const baseUrl = "http://localhost:8012/api/";

const baseApi = axios.create({
  baseURL: baseUrl
});

export async function createUser({ email, password, maxTemp, tempToSet }) {
  return await baseApi.post(
    "user/",
    {
      email: email,
      password: password,
      maxTemp: maxTemp,
      tempToSet: tempToSet
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export async function deleteUser({ email, password }) {
  return await baseApi.delete("user/", {
    data: {
      email: email,
      password: password
    },
    headers: { "Content-Type": "application/json" }
  });
}
