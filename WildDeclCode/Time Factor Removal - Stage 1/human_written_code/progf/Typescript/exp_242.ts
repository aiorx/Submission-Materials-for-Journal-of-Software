var axios = require('axios');

const instance = axios.create()

const intercept = function (fn: (height: string) => void) {
  return instance.interceptors.response.use((response) => {
    const data = response.data

    if (data && !Array.isArray(data) && typeof data === 'object') {
      if (typeof data.height === 'string') {
        fn(data.height)
      }
    }

    return response
  })
}rn response
  })
}

module.exports = instance;
