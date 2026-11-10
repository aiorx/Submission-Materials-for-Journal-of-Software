var Module = require('@nestjs/common').Module;
var CacheModule = require('@nestjs/common').CacheModule;
var HttpModule = require('@nestjs/common').HttpModule;
var MongooseModule = require('@nestjs/mongoose').MongooseModule;

var CustomerSchema = require('src/modules/backoffice/schemas/customer.schema').CustomerSchema;
var UserSchema = require('src/modules/backoffice/schemas/user.schema').UserSchema;

var AccountService = require('src/modules/backoffice/services/account.service').AccountService;
var AddressService = require('src/modules/backoffice/services/address.service').AddressService;
var CustomerService = require('src/modules/backoffice/services/customer.service').CustomerService;
var PetService = require('src/modules/backoffice/services/pet.service').PetService;

var AddressController = require('src/modules/backoffice/controllers/address.controller').AddressController;
var CustomerController = require('src/modules/backoffice/controllers/customer.controller').CustomerController;
var PetController = require('src/modules/backoffice/controllers/pet.controller').PetController;
var AuthService = require('src/shared/services/auth.service').AuthService;
var AccountController = require('./controllers/account.controller').AccountController;
var PassportModule = require('@nestjs/passport').PassportModule;
var JwtModule = require('@nestjs/jwt').JwtModule;
var JwtStrategy = require('src/shared/strategies/jwt.strategy').JwtStrategy;

@Module({
    imports: [
        CacheModule.register(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600,
            },
        }),
        MongooseModule.forFeature([
            {
                name: 'Customer',
                schema: CustomerSchema,
            },
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
        HttpModule
    ],
    controllers: [AddressController, CustomerController, PetController, AccountController],
    providers: [AccountService, AddressService, CustomerService, PetService, AuthService, JwtStrategy],
})
class BackofficeModule {

}
