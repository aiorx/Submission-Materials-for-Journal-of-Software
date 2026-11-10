var Build = require('vso-node-api/interfaces/BuildInterfaces').Build;
var IBuildApi = require('vso-node-api/BuildApi').IBuildApi;

class BuildApi {
    constructor(private buildApi: IBuildApi) { }

    public queueBuild(build: Build, project: string, ignoreWarnings: boolean) {
        return this.buildApi.queueBuild(build, project, ignoreWarnings);
    }

    public getDefinitions(project: string) {
        return this.buildApi.getDefinitions(project);
    }

    public getBuild(buildId: number) {
        return this.buildApi.getBuild(buildId);
    }
}