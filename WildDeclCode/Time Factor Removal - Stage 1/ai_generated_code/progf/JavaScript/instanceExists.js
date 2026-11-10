var FaucetConfigModel = require('../schemas/faucetConfig.js').FaucetConfigModel;
/* |----------------------------------------------------------| */
/* |             Quite an essential function here             | */
/* |                  Used in multiple files                  | */
/* |       Code Crafted with basic coding tools, pray it doesn't break        | */
/* |----------------------------------------------------------| */

export async function instanceExists(instanceName) {
  // Check if instance exists using findOne
  const instance = FaucetConfigModel
      .findOne({name: instanceName})
      .lean();

  return !!instance;
}
