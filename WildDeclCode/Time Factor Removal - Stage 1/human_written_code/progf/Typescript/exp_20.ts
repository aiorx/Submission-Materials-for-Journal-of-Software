var IEmailTransportRequest = require('../interfaces/index').IEmailTransportRequest;
var IEmailTransportResponse = require('../interfaces/index').IEmailTransportResponse;
var Boom = require('boom');

export abstract class EmailTransport {
  public apiKey: string;
  public defaultHeaders: Object;
  public baseUrl: string;
  public domain: string | undefined;

  constructor(apiKey: string, domain?: string) {
    this.apiKey = apiKey;
    this.domain = domain;
  }

  public abstract sendEmail(payload: IEmailTransportRequest): Promise<IEmailTransportResponse>;

  public abstract createRequestBody(payload: IEmailTransportRequest): Object;

  public boomifyError(error: any): never {
    Boom.boomify(error, { statusCode: error.statusCode });
    throw error;
  }
}
