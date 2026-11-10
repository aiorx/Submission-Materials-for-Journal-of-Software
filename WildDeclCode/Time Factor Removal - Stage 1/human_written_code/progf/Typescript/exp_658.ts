var HttpModule = require('@nestjs/axios').HttpModule;
var Module = require('@nestjs/common').Module;
var MongooseModule = require('@nestjs/mongoose').MongooseModule;
var ConfigModule = require('@nestjs/config').ConfigModule;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: "./local.env" });
var AppController = require('./app.controller').AppController;
var AppService = require('./app.service').AppService;

var UserModule = require('./modules/users/user.module').UserModule;
var AuthModule = require('./modules/auth/auth.module').AuthModule;
var IspeakModule = require('./modules/ispeak/ispeak.module').IspeakModule;
var OpenApiModule = require('./modules/openApi/openApi.module').OpenApiModule;

const controllers = [AppController];
const providers = [AppService];

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    IspeakModule,
    OpenApiModule,
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
    }),
  ],
  controllers,
  providers,
})
class AppModule {}
