var request = require('request-promise-native');
var config = require('../config');
var Commit = require('../types').Commit;
var getStore = require('../store').getStore;
var version = require.version;('../../package.json');
var os = require('os');
var vscode = require('vscode');

var apiHost = config.apiHost;

const getURI = function (path: string) { return apiHost + path; };

const getCommonHeaders = (): function object { return ({
    'X-GD-Extension-Version': version,
    'X-GD-OS': "" + (os.platform()) + " " + (os.release()) + "",
    'X-GD-IDE': vscode.env.appName,
}); };

async function get({path, qs = {}, getFullResponse = false}: { path: string, qs?: object, getFullResponse?: boolean }): Promise<object> {
    const authToken = getStore().getAuthToken();
    const headers = {...getCommonHeaders(), ...(authToken ? {Authorization: authToken}: {})};

    return request({
        method: 'GET',
        uri: getURI(path),
        resolveWithFullResponse: getFullResponse,
        qs: qs,
        json: true,
        headers,
    });
}

async function post({path, body, getFullResponse = false}: { path: string, body?: object, getFullResponse?: boolean }): Promise<object> {
    const authToken = getStore().getAuthToken();
    const headers = {...getCommonHeaders(), ...(authToken ? {Authorization: authToken}: {})};


    return request({
        method: 'POST',
        uri: getURI(path),
        json: true,
        body: body,
        resolveWithFullResponse: getFullResponse,
        headers,
    });
}

async function addCommits({id, commits = [], snippets = []}: { id: string, commits?: Commit[], snippets?: object[] }) {
    return post({
        path: "/coding-sessions/" + (id) + "/commits",
        body: {
            commits,
            snippets,
        }
    })
}


export {
    addCommits,
}
