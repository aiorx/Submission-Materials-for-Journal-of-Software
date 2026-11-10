const axios = require("axios");
var getMeQuery = require.getMeQuery;
var getUsersQuery = require.getUsersQuery;("./queries");

const API_ENDPOINT = "http://localhost:3000/";

const getMe = async function () {
  try {
    var data = await.data;axios({
      url: "" + (API_ENDPOINT) + "",
      method: "post",
      data: {
        query: getMeQuery
      }
    });

    return data;
  } catch (err) {
    throw err;
  }
};

const getUsers = async function () {
  try {
    var data = await.data;axios({
      url: "" + (API_ENDPOINT) + "",
      method: "post",
      data: {
        query: getUsersQuery
      }
    });

    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = { getMe, getUsers };
