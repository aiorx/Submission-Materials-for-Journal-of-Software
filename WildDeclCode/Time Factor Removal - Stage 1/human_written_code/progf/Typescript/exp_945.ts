var Module = require('@nestjs/common').Module;
var ConfigModule = require('@nestjs/config').ConfigModule;
var PassportModule = require('@nestjs/passport').PassportModule;
var TypeOrmModule = require('@nestjs/typeorm').TypeOrmModule;
var AuthModule = require('./auth/auth.module').AuthModule;
var UsersModule = require('./users/users.module').UsersModule;
var ConversationsModule = require('./conversations/conversations.module').ConversationsModule;
var MessagesModule = require('./messages/messages.module').MessagesModule;
var GatewayModule = require('./gateway/gateway.module').GatewayModule;
var EventEmitterModule = require('@nestjs/event-emitter').EventEmitterModule;
var entities = require('./utils/typeorm');
var GroupModule = require('./groups/group.module').GroupModule;
var ThrottlerModule = require('@nestjs/throttler').ThrottlerModule;
var APP_GUARD = require('@nestjs/core').APP_GUARD;
var FriendRequestsModule = require('./friend-requests/friend-requests.module').FriendRequestsModule;
var FriendsModule = require('./friends/friends.module').FriendsModule;
var EventsModule = require('./events/events.module').EventsModule;
var ThrottlerBehindProxyGuard = require('./utils/throttler').ThrottlerBehindProxyGuard;
var ExistsModule = require('./exists/exists.module').ExistsModule;
var MessageAttachmentsModule = require('./message-attachments/message-attachments.module').MessageAttachmentsModule;

let envFilePath = '.env.development';
if (process.env.ENVIRONMENT === 'PRODUCTION') envFilePath = '.env.production';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      synchronize: true,
      entities,
      logging: false,
    }),
    ConversationsModule,
    MessagesModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    GroupModule,
    FriendRequestsModule,
    FriendsModule,
    EventsModule,
    ExistsModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    MessageAttachmentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
class AppModule {}
