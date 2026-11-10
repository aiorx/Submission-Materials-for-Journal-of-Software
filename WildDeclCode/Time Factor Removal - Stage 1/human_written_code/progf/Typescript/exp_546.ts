var MiddlewareConsumer = require('@nestjs/common').MiddlewareConsumer;
var Module = require('@nestjs/common').Module;
var NestModule = require('@nestjs/common').NestModule;
var RequestMethod = require('@nestjs/common').RequestMethod;
var ConfigModule = require('@nestjs/config').ConfigModule;
var GraphQLModule = require('@nestjs/graphql/dist/graphql.module').GraphQLModule;
var TypeOrmModule = require('@nestjs/typeorm').TypeOrmModule;
var Joi = require('joi');
var UsersModule = require('./users/users.module').UsersModule;
var User = require('./users/entities/user.entity').User;
var Verification = require('./users/entities/verification.entity').Verification;
var JwtModule = require('./jwt/jwt.module').JwtModule;
var JwtMiddleware = require('./jwt/jwt.middleware').JwtMiddleware;
var MailModule = require('./mail/mail.module').MailModule;
var Restaurant = require('./restaurants/entities/restaurant.entity').Restaurant;
var Category = require('./restaurants/entities/category.entity').Category;
var RestaurantsModule = require('./restaurants/restaurants.module').RestaurantsModule;
var AuthModule = require('./auth/auth.module').AuthModule;
var Dish = require('./restaurants/entities/dish.entity').Dish;
var OrdersModule = require('./orders/orders.module').OrdersModule;
var Order = require('./orders/enitities/order.entity').Order;
var OrderItem = require('./orders/enitities/order-item.entity').OrderItem;
var CommonModule = require('./common/common.module').CommonModule;
var PaymentsModule = require('./payments/payments.module').PaymentsModule;
var Payment = require('./payments/entities/payment.entity').Payment;
var ScheduleModule = require('@nestjs/schedule').ScheduleModule;
var UploadsModule = require('./uploads/uploads.module').UploadsModule;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY:Joi.string().required(),
        MAILGUN_DOMAIN_NAME:Joi.string().required(),
        MAILGUN_FROM_EMAIL:Joi.string().required()
      })
    }),
    TypeOrmModule.forRootAsync({
      useFactory: function () { return ({
        type: 'postgres',
        ...(process.env.DATABASE_URL
          ? { url: process.env.DATABASE_URL }
          : {
              host: process.env.DB_HOST,
              port: +process.env.DB_PORT,
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
            }),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: ['migration/**/*{.ts,.js}'],
        migrationsTableName: 'migrations_typeorm',
        synchronize: false,
        cli: {
          migrationsDir: 'migration',
        },

        logging:
          process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      }); },
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: function ({ req, connection }) {
        const TOKEN_KEY = 'x-jwt'
        if (req) {
          return { token: req.headers[TOKEN_KEY] } 
        } else if(connection) {
          return { token: connection.context[TOKEN_KEY] }
        }
      }
    }),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privatekey: process.env.PRIVATE_KEY
    }),
    MailModule.forRoot({
      apiKey:process.env.MAILGUN_API_KEY,
      domain:process.env.MAILGUN_DOMAIN_NAME,
      fromEmail:process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    UploadsModule
  ],
  controllers: [],
  providers: [],
})
class AppModule{}