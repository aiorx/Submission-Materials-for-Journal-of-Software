var AzureFunction = require('@azure/functions').AzureFunction;
var Context = require('@azure/functions').Context;
var HttpRequest = require('@azure/functions').HttpRequest;
var getPandaImage = require('../common/pandaHelpers').getPandaImage;
var getPandaFact = require('../common/pandaHelpers').getPandaFact;

// Backend API style function
// Returns a url of a panda image and a random panda fact
const run: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {  
    context.log("Starting HTTP triggered function " + (context.executionContext.functionName) + "");

    // Use common helper functions.
    const url = await getPandaImage(context.log);
    const fact = getPandaFact(context.log);

    // Default response status is 200
    const response = {
        body: {
            url,
            fact
        }
    };

    return response;
};

module.exports = run;
