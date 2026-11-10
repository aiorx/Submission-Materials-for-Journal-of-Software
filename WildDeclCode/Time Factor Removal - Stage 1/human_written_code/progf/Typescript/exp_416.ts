var Module = require('@nestjs/common').Module;
var CacheModule = require('@nestjs/common').CacheModule;
var TypeOrmModule = require('@nestjs/typeorm').TypeOrmModule;
var GraphQLModule = require('@nestjs/graphql').GraphQLModule;
var GraphqlModule = require('./config/graphql/graphql.module').GraphqlModule;
var GraphqlService = require('./config/graphql/graphql.service').GraphqlService;
var TypeormModule = require('./config/typeorm/typeorm.module').TypeormModule;
var TypeormService = require('./config/typeorm/typeorm.service').TypeormService;
var CacheService = require('./config/cache/cache.service').CacheService;
var UserModule = require('./modules/user/user.module').UserModule;
var DataloaderModule = require('./shared/dataloader/dataloader.module').DataloaderModule;
var DishModule = require('./modules/dish/dish.module').DishModule;
var SiteModule = require('./modules/site/site.module').SiteModule;
@Module({
	imports: [
		GraphQLModule.forRootAsync({
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		UserModule,
		GraphqlModule,
		TypeormModule,
		DataloaderModule,
		DishModule,
		SiteModule
	]
})
class AppModule {}
