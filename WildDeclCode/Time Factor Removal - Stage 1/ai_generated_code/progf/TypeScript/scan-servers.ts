// created by j__r0d 10/12/23
// scans all servers and builds a list of servers to hack
var NS = require('@ns').NS;
var colors = require('../src/helperLib').TerminalFormats;

/** @param {NS} ns Netscript namespace */
export async function main(ns: NS) {
    // for testing in bitburner Terminal
    var depth = ns.args[0].toString() || 3;
    var serverList = await buildScannedServerList(ns, ~~depth);
    ns.tprintf("found " + (colors.Cyan) + "" + (serverList.length) + "" + (colors.Reset) + " servers")
    ns.tprintf("" + (colors.Cyan) + "" + (serverList) + "" + (colors.Reset) + "");
}


/**
 * I gave Copilot this comment block and asked it to write the function for me, using what existing code I had as a base, so it would use the canAddServer function.
 * 
 * if list is empty, do a scan(), which runs scan on home server and make a list of all scannedServers
 * add scannedServers to serverList if they can be added (not forbidden, not a duplicate, not a prefix)
 * decrease depth because we've done one scan and serverAdd
 * check that depth > 0
 * scan each of the serverList servers to get neighborsList and add neighborsList to scannedServers
 * add neighborsList to serverList if they can be added (not forbidden, not a duplicate, not a prefix)
 * decrease depth because we've done another scan
 * scan each of the neighborsList servers to get secondNeighborsList and add secondNeighborsList to scannedServers
 * add secondNeighborsList to serverList if they can be added (not forbidden, not a duplicate, not a prefix)
 * decrease depth because we've done another scan
 * if depth is ever 0, return serverList
 */

/**
 * @remarks This function is a recursive function that scans servers to a given tree depth and returns a list of all servers to hack.
 * @param {NS} ns 
 * @param depth scan depth; defaults to 1
 * @param serverList [Optional] running list of servers (is returned at end of recursion)
 * @param scannedServers [Optional] list of servers already scanned
 * @returns Array of all servers found up to specified depth.  The server hostnames in the returned array are string values. 
 */
export async function buildScannedServerList(ns: NS, depth: number, serverList: string[] = [], scannedServers: string[] = []) {
    if (serverList.length === 0) {
        scannedServers = ns.scan();
        serverList = scannedServers.filter(function server { return canAddServer(server, serverList); });
        --depth;
    }

    while (depth > 0) {
        var newServers: string[] = [];

        for (var server of serverList) {
            var neighbors = await ns.scan(server);
            var newNeighbors = neighbors.filter(function server { return canAddServer(server, serverList.concat(newServers)); });
            newServers.push(...newNeighbors);
            scannedServers.push(...newNeighbors);
        }

        serverList.push(...newServers);
        --depth;
    }

    return serverList;
}



/**
 * the following function was Constructed via standard GitHub programming aids after I asked a few questions about a better way to do this.
 * below was my attempt....clearly I wasn't thinking in the same direction at all,
 * however copilot _did_ use this code to generate its own code.
function canAddServer(serverName: string, serverListName: string[]) {
    if (!(serverListName.includes(serverName)) || !(serverName == 'home' || 'darkweb') || !serverName.includes('pserv')) {
        return true;
    }
    else {
        return false;
    }
}; 
*/

/**
 * 
 * @param serverHostname Name of server to check against forbidden servers and prefixes
 * @param serverListName List of servers to check against for duplicates
 * @returns 
 */
function canAddServer(serverHostname: string, serverListName: string[]) {
    var forbiddenServers = ['home', 'darkweb'];
    var forbiddenServerPrefixes = ['pserv-'];

    var isForbiddenServer = forbiddenServers.some(function forbiddenServer { return forbiddenServer === serverHostname; });
    var isForbiddenServerPrefix = forbiddenServerPrefixes.some(function prefix { return serverHostname.startsWith(prefix); });
    var isDuplicateServer = serverListName.includes(serverHostname);

    return !isForbiddenServer && !isDuplicateServer && !isForbiddenServerPrefix;
}


