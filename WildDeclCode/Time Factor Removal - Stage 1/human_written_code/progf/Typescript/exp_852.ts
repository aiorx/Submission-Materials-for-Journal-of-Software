var IsEmail = require('class-validator').IsEmail;
var Length = require('class-validator').Length;
var Arg = require('type-graphql').Arg;
var Field = require('type-graphql').Field;
var InputType = require('type-graphql').InputType;
var Mutation = require('type-graphql').Mutation;
var ObjectType = require('type-graphql').ObjectType;
var Resolver = require('type-graphql').Resolver;
var getRepository = require('typeorm').getRepository;
var Repository = require('typeorm').Repository;
var User = require('../entity/user.entity').User;
var hash = require('bcryptjs').hash;
var compareSync = require('bcryptjs').compareSync;
var sign = require('jsonwebtoken').sign;
var environment = require('../config/environment').environment;

@InputType()
class UserInput {

    @Field()
    @Length(3, 64)
    fullName!: string

    @Field()
    @IsEmail()
    email!: string

    @Field()
    @Length(8, 254)
    password!: string

}

@InputType()
class LoginInput {

    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;
}

@ObjectType()
class LoginResponse {

    @Field()
    userId!: number;

    @Field()
    jwt!: string;
}

@Resolver()
class AuthResolver {

    userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    @Mutation(function () { return User; })
    async register(
        @Arg('input', function () { return UserInput; }) input: UserInput
    ): Promise<User | undefined> {

        try {
            var fullName = input.fullName;
var email = input.email;
var password = input.password;

            const userExists = await this.userRepository.findOne({ where: { email } });

            if (userExists) {
                const error = new Error();
                error.message = 'Email is not available';
                throw error;
            }

            const hashedPassword = await hash(password, 10);

            const newUser = await this.userRepository.insert({
                fullName,
                email,
                password: hashedPassword,
            })

            return this.userRepository.findOne(newUser.identifiers[0].id)


        } catch (error) {
            throw new Error(error.message)
        }
    }

    @Mutation(function () { return LoginResponse; })
    async login(
        @Arg('input', function () { return LoginInput; }) input: LoginInput
    ) {
        try {
            var email = input.email;
var password = input.password;

            const userFound = await this.userRepository.findOne({ where: { email } });

            if (!userFound) {
                const error = new Error();
                error.message = 'Invalid credentials';
                throw error;
            }

            const isValidPasswd: boolean = compareSync(password, userFound.password);

            if (!isValidPasswd) {
                const error = new Error();
                error.message = 'Invalid credentials';
                throw error;
            }

            const jwt: string = sign({ id: userFound.id }, environment.JWT_SECRET);

            return {
                userId: userFound.id,
                jwt: jwt,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

}