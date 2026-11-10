var Controller = require('@nestjs/common').Controller;
var Get = require('@nestjs/common').Get;
var Redirect = require('@nestjs/common').Redirect;
var ApiExcludeEndpoint = require('@nestjs/swagger').ApiExcludeEndpoint;
var AppService = require('./app.service').AppService;

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  @Redirect('/api/docs')
  index() {
    return {};
  }
}
