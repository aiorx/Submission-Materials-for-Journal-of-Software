var axios = require('axios');
var Tutorial = require('../types/Tutorial');

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});

const findAll = async function () {
  const response = await apiClient.get<Tutorial[]>("/tutorials");
  return response.data;
}

const findById = async function (id: any) {
  const response = await apiClient.get<Tutorial>("/tutorials/" + (id) + "");
  return response.data;
}

const findByTitle = async function (title: string) {
  const response = await apiClient.get<Tutorial[]>("/tutorials?title=" + (title) + "");
  return response.data;
}

const create = async function ({ title, description }: Tutorial) {
  const response = await apiClient.post<any>("/tutorials", { title, description });
  return response.data;
}

const update = async function (id: any, { title, description, published }: Tutorial) {
  const response = await apiClient.put<any>("/tutorials/" + (id) + "", { title, description, published });
  return response.data;
}

const deleteById = async function (id: any) {
  const response = await apiClient.delete<any>("/tutorials/" + (id) + "");
  return response.data;
}

const deleteAll = async function () {
  const response = await apiClient.delete<any>("/tutorials");
  return response.data;
}

const TutorialService = {
  findAll,
  findById,
  findByTitle,
  create,
  update,
  deleteById,
  deleteAll
}

module.exports = TutorialService;
