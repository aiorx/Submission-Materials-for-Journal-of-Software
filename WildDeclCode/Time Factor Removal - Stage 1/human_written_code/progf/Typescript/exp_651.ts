var Body = require('@nestjs/common').Body;
var Controller = require('@nestjs/common').Controller;
var Post = require('@nestjs/common').Post;
var Get = require('@nestjs/common').Get;

var UserService = require('../shared/user.service').UserService;
var Payload = require('../types/payload').Payload;
var LoginDTO = require('./auth.dto').LoginDTO;
var RegisterDTO = require('./auth.dto').RegisterDTO;
var AuthService = require('./auth.service').AuthService;

@Controller('auth')
class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
