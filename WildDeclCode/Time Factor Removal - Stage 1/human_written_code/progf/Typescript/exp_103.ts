var inject = require('inversify').inject;
var injectable = require('inversify').injectable;
var ILogger = require('./services/Logger/interface/ILogger').ILogger;
var DependencyIdentifier = require('./DependencyIdentifiers').DependencyIdentifier;
require('reflect-metadata');

@injectable()
class AuctionMonitorApp {

    public constructor(@inject(DependencyIdentifier.LOGGER) private logger: ILogger) {
    }

    public async start(): Promise<void> {

        this.logger.log("Auction Monitor started.");

        // TODO: Retrieve auctions and display aggregated information (see README.md)

    }

}