var _import = require('axios');

fetch.interceptors.response.use(function (response) { return response; }, function (error) { return error; });

export async function fetchData(url:string, method:Method = 'GET', headers?:any) {
  const ret = await fetch({
    url,
    method,
    headers,
    transformResponse: function (req) { return req; },
    withCredentials: true,
    timeout: 29000,
  });
  return ret.data;
}

export async function sendData(url:string, method:Method = 'POST', data:string, headers?:any) {
  const ret = await fetch({
    url,
    method,
    data,
    transformResponse: function (req) { return req; },
    headers,
    withCredentials: true,
    timeout: 29000,
  });
  return ret.data;
}
