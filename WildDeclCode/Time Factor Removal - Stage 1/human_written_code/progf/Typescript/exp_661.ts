var Controller = require('@nestjs/common').Controller;
var Get = require('@nestjs/common').Get;
var Post = require('@nestjs/common').Post;
var Put = require('@nestjs/common').Put;
var UploadedFile = require('@nestjs/common').UploadedFile;
var UseInterceptors = require('@nestjs/common').UseInterceptors;
var ApiBody = require('@nestjs/swagger').ApiBody;
var ApiConsumes = require('@nestjs/swagger').ApiConsumes;
var ApiOperation = require('@nestjs/swagger').ApiOperation;
var ApiTags = require('@nestjs/swagger').ApiTags;
var AppService = require('./app.service').AppService;
var FileInterceptor = require('@nestjs/platform-express').FileInterceptor;


const ApiFile =
  (fileName: string = 'file'): function MethodDecorator { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  }; };
@ApiTags("公共接口")
@Controller('app')

class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

 
  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors( FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: any): Promise<any> {
      console.log("0000", file)
  }
}

