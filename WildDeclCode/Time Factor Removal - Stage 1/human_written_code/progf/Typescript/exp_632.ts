var Controller = require('tsoa').Controller;
var Get = require('tsoa').Get;
var Post = require('tsoa').Post;
var Route = require('tsoa').Route;
var Delete = require('tsoa').Delete;
var Body = require('tsoa').Body;
var Path = require('tsoa').Path;
var Put = require('tsoa').Put;
var Digest = require('@js-machine-app/models').Digest;
var Inject = require('@js-machine-app/api/ioc').Inject;
var DigestsService = require('@js-machine-app/api/services/digests').DigestsService;

@Route('digests')
class DigestsController extends Controller {
  @Inject() private digestsService!: DigestsService;

  @Get()
  public async getDigests(): Promise<Digest[]> {
    return this.digestsService.getDigests();
  }

  @Get('{id}')
  public async getDigestById(@Path() id: string): Promise<Digest> {
    return this.digestsService.getDigestById(id);
  }

  @Post()
  public async createDigest(@Body() digest: Digest): Promise<string> {
    return this.digestsService.createDigest(digest);
  }

  @Put('{id}')
  public async updateDigest(
    @Path() id: string,
    @Body() digest: Digest,
  ): Promise<void> {
    return this.digestsService.updateDigest(id, digest);
  }

  @Delete('{id}')
  public async deleteDigest(@Path() id: string): Promise<void> {
    return this.digestsService.deleteDigest(id);
  }
}
