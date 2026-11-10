var axios = require('axios');
var getAccessToken = require('./tokens').getAccessToken;
var getRefreshToken = require('./tokens').getRefreshToken;
var storeTokens = require('./tokens').storeTokens;
var clearTokens = require('./tokens').clearTokens;

// Address for Android app to connect to the backend server and database
const BACKEND_URL = 'http://10.0.2.2:5000'; 
const api = axios.create({
  baseURL: BACKEND_URL,
});

// This code was Produced with third-party coding tools

// Request interceptor to automatically attach the access token to every outgoing request
api.interceptors.request.use(async function (config) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + (accessToken) + "";
    }
    return config;
});

// Response interceptor to handle token expireation and refresh tokens
api.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          try {
            const response = await api.post("" + (BACKEND_URL) + "/refresh", {
              refresh_token: refreshToken,
            });
            var access_token = response.data.access_token;
var refresh_token = response.data.refresh_token;
            await storeTokens(access_token, refresh_token);
            api.defaults.headers.common["Authorization"] = "Bearer " + (access_token) + "";
            return api(originalRequest);
          } catch (err) {
            console.error("Error refreshing token:", err);
            await clearTokens();
          }
        }
      }
      return Promise.reject(error);
    }
);

module.exports = api;
