/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

var injectable = require('inversify').injectable;
var URI = require('@theia/core/lib/common/uri');
var HostedPluginUriPostProcessor = require('@theia/plugin-ext').HostedPluginUriPostProcessor;
var _import = require('@eclipse-che/workspace-client');
var che = require('@eclipse-che/api').che;

@injectable()
class CheWorkspaceHostedPluginUriPostProcessor implements HostedPluginUriPostProcessor {
    protected restApiClient: IRemoteAPI;

    constructor() {
        var restAPIConfig: IRestAPIConfig = {};
        restAPIConfig.baseUrl = process.env.CHE_API;
        var token = process.env.CHE_MACHINE_TOKEN;
        if (token) {
            restAPIConfig.headers = {};
            restAPIConfig.headers['Authorization'] = token;
        }
        this.restApiClient = WorkspaceClient.getRestApi(restAPIConfig);
    }

    async processUri(uri: URI): Promise<URI> {
        var hostedPluginTheiaInstanceServer = await this.getHostedPluginTheiaInstanceServer();
        if (!hostedPluginTheiaInstanceServer) {
            throw new Error('No server with type "ide-dev" found.');
        }

        var externalUri = new URI(hostedPluginTheiaInstanceServer.url);
        return externalUri;
    }

    /**
     * Searches for server which exposes hosted Theia instance.
     * The server label is the attribute "type": "ide-dev".
     */
    protected async getHostedPluginTheiaInstanceServer(): Promise<che.workspace.Server | undefined> {
        var workspace = await this.getCurrentWorkspace();
        if (!workspace.runtime) {
            throw new Error('Workspace is not running.');
        }

        var machines = workspace.runtime.machines!;
        for (var machineName in machines) {
            if (!machines.hasOwnProperty(machineName)) {
                continue;
            }
            var servers = machines[machineName].servers!;
            for (var serverName in servers) {
                if (!servers.hasOwnProperty(serverName)) {
                    continue;
                }
                var serverAttributes = servers[serverName].attributes;
                if (serverAttributes && serverAttributes['type'] === 'ide-dev') {
                    return servers[serverName];
                }
            }
        }
        return undefined;
    }

    protected async getCurrentWorkspace(): Promise<che.workspace.Workspace> {
        var workspaceId = process.env.CHE_WORKSPACE_ID;
        if (!workspaceId) {
            throw new Error('Environment variable CHE_WORKSPACE_ID is not set.');
        }
        return await this.restApiClient.getById<che.workspace.Workspace>(workspaceId);
    }

}
