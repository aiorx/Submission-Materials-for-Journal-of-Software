import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from "type-graphql";
var hash = require('bcryptjs').hash;
var compare = require('bcryptjs').compare;
var User = require('./entity/User').User;
var MyContext = require('./MyContext').MyContext;
var createRefreshToken = require('./auth').createRefreshToken;
var createAccessToken = require('./auth').createAccessToken;
var isAuth = require('./isAuth').isAuth;
var sendRefreshToken = require('./sendRefreshToken').sendRefreshToken;
var getConnection = require('typeorm').getConnection;
var verify = require('jsonwebtoken').verify;

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(function () { return User; })
  user: User;
}

@Resolver()
class UserResolver {
  @Query(function () { return String; })
  hello() {
    return "hi!";
  }

  @Query(function () { return String; })
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return "your user id is: " + (payload!.userId) + "";
  }

  @Query(function () { return [User]; })
  users() {
    return User.find();
  }

  @Query(function () { return User; }, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(function () { return Boolean; })
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  @Mutation(function () { return Boolean; })
  async revokeRefreshTokensForUser(@Arg("userId", function () { return Int; }) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(function () { return LoginResponse; })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    // login successful

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  @Mutation(function () { return Boolean; })
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
