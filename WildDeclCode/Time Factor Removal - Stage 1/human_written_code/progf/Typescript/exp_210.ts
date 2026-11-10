var ClientProxy = require('@nestjs/microservices').ClientProxy;
export declare class AppController {
    private readonly client;
    constructor(client: ClientProxy);
    onApplicationBootstrap(): Promise<void>;
    getHello(): string;
}
