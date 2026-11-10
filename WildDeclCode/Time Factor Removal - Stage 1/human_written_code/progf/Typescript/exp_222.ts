var fs = require('fs');
var get = require('../lib/http-get');
var settings = require('./settings');
var SettingsObject = require('./types').SettingsObject;
var getFormattedData = require('./parser').getFormattedData;

const CMSSync = function (config: SettingsObject[]) {
  config.forEach((item: SettingsObject) => {
    get(item.url).then((res: any) => {
      const formattedData = getFormattedData(item.type, res.data)
      fs.writeFile("src/config/constants/" + (item.name) + ".json", JSON.stringify(formattedData, undefined, 2), (err) => {
        if (err) throw err
        console.info(" ✅ - " + (item.name) + " has been saved!")
      })
    })
  })
}

CMSSync(settings)

module.exports = CMSSync;
