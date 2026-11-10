var BaseController = require('./BaseController').BaseController;
var UserAccountService = require('../service').UserAccountService;
var UserService = require('../service').UserService;
var Provider = require('../model/Enum').Provider;
var BaseProvider = require('../provider/BaseProvider').BaseProvider;
var Container = require('typedi');
var IuserDTOClass = require('../dto/UserDTO').IuserDTOClass;

class BaseAuthController<T extends BaseProvider> extends BaseController {
  // this can be used in child class (ExampleAuthController)
  protected userAccountService: UserAccountService;
  protected userService: UserService;
  constructor(protected provider: T) {
    super();
    this.provider = provider;
    this.userAccountService = Container.get(UserAccountService);
    this.userService = Container.get(UserService);
  }

  async login(clientId: string) {
    const userAccount = await this.userAccountService.getOrNewAccount({
      provider: Provider['KAKAO'],
      clientId,
    });
    if (userAccount.user == null) return { result: false, jwt: '' };
    else {
      const jwt = await this.provider.generateToken(userAccount.user.id);
      return { result: true, jwt };
    }
  }

  async register(userDTO: IuserDTOClass, clientId: string) {
    const user = await this.userService.createOrUpdate(
      {
        nickname: userDTO.nickname,
        name: userDTO.name,
        birthday: userDTO.birthday,
        profile: userDTO.profile,
        phone: userDTO.phone,
        email: userDTO.email,
      },
      clientId,
    );
    const jwt = await this.provider.generateToken(user.id);
    return { result: true, jwt, user };
  }
}
