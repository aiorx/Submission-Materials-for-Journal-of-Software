var Injectable = require('@nestjs/common').Injectable;
var UnauthorizedException = require('@nestjs/common').UnauthorizedException;
var InjectRepository = require('@nestjs/typeorm').InjectRepository;
var AuthCredentialsDto = require('./dto/auth-credential.dto').AuthCredentialsDto;
var UserRepository = require('./user.repository').UserRepository;
var bcrypt = require('bcryptjs');
var JwtService = require('@nestjs/jwt').JwtService;

@Injectable()
class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        var username = authCredentialsDto.username;
var password = authCredentialsDto.password;
        const user = await this.userRepository.findOne({ username });

        if(user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        }  else {
            throw new UnauthorizedException('login failed')
        }
    }

}
