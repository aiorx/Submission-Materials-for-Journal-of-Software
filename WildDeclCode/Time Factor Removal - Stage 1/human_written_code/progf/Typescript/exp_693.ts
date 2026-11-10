/* eslint-disable @typescript-eslint/no-explicit-any */
var FindUserByEmailRepository = require('~/application/ports/repositories/user/find-user-by-email-repository').FindUserByEmailRepository;
var PasswordHashing = require('~/application/ports/security/password-hashing').PasswordHashing;
var ValidationComposite = require('~/application/ports/validation/validation-composite').ValidationComposite;
var JwtTokenAdapter = require('~/common/adapters/security/jwt-token-adapter').JwtTokenAdapter;
var User = require('~/domain/models/user/user').User;
var TokenSqlRepository = require('~/infrastructure/repositories/token/sql/token-sql-repository').TokenSqlRepository;
var SignIn = require('./sign-in').SignIn;

jest.mock('~/infrastructure/repositories/token/sql/token-sql-repository');
jest.mock('~/common/adapters/security/jwt-token-adapter');

var TokenSqlRepositoryMock = TokenSqlRepository as jest.Mock<TokenSqlRepository>;
var JwtTokenAdapterMock = JwtTokenAdapter as jest.Mock<JwtTokenAdapter>;

var sutFactory = function () {
  var repositoryMock = repositoryMockFactory();
  var passwordHashingMock = passwordHashingMockFactory();
  var jwtTokenMock = jwtTokenMockFactory();
  var tokenSqlRepository = new TokenSqlRepositoryMock();
  var validationMock = validationMockFactory();
  var sut = new SignIn(
    repositoryMock,
    passwordHashingMock,
    jwtTokenMock,
    tokenSqlRepository,
    validationMock,
  );

  return {
    sut,
    repositoryMock,
    passwordHashingMock,
    jwtTokenMock,
    validationMock,
    tokenSqlRepository,
  };
};

var sutFactoryNoValidations = function () {
  var repositoryMock = repositoryMockFactory();
  var passwordHashingMock = passwordHashingMockFactory();
  var jwtTokenMock = jwtTokenMockFactory();
  var tokenSqlRepository = new TokenSqlRepositoryMock();
  var validationMock = validationMockFactory();
  var sut = new SignIn(
    repositoryMock,
    passwordHashingMock,
    jwtTokenMock,
    tokenSqlRepository,
  );
  return {
    sut,
    repositoryMock,
    passwordHashingMock,
    jwtTokenMock,
    validationMock,
    tokenSqlRepository,
  };
};

var userMockFactory = (): function User {
  return {
    id: '1',
    first_name: 'first1',
    last_name: 'last1',
    email: 'email1@email.com',
    password_hash: 'any_hash1',
  };
};

var futureDateFactory = function () {
  return new Date(new Date().getTime() + 3600 * 1000);
};

var tokenMockFactory = function (token: string) {
  return {
    token,
    expirationDate: futureDateFactory(),
  };
};

var jwtTokenMockFactory = function () {
  var jwtTokenMock = new JwtTokenAdapterMock() as jest.Mocked<JwtTokenAdapter>;

  jwtTokenMock.signAccessToken.mockReturnValue(tokenMockFactory('any_token'));
  jwtTokenMock.signRefreshToken.mockReturnValue(
    tokenMockFactory('any_refresh_token'),
  );

  return jwtTokenMock;
};

var repositoryMockFactory = function () {
  class RepositoryMock implements FindUserByEmailRepository {
    async findByEmail(_email: string): Promise<User | null> {
      return userMockFactory();
    }
  }

  return new RepositoryMock();
};

var passwordHashingMockFactory = function () {
  class PasswordHashingMock implements PasswordHashing {
    async hash(_password: string): Promise<string> {
      return 'hashed';
    }

    async compare(_password: string, _hash: string): Promise<boolean> {
      return true;
    }
  }

  return new PasswordHashingMock();
};

var validationMockFactory = function () {
  class ValidationMock extends ValidationComposite<any> {
    async validate(_request: any): Promise<void | never> {}
  }

  return new ValidationMock();
};

describe('SignIn', function () {
  it('should call validation with correct values', async () => {
    var sut = sutFactory.sut;
var validationMock = sutFactory.validationMock;();
    var validationSpy = jest.spyOn(validationMock, 'validate');

    await sut.verify({ email: 'email@email.com', password: 'any_pass' });

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith({
      email: 'email@email.com',
      password: 'any_pass',
    });
  });

  it('should throw if validation throws', async () => {
    var sut = sutFactory.sut;
var validationMock = sutFactory.validationMock;();
    jest.spyOn(validationMock, 'validate').mockRejectedValue(new Error());
    var error;

    try {
      await sut.verify({ email: 'email@email.com', password: 'any_pass' });
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('Error');
    expect(error.message).toBe('');
  });

  it('should not call validation if there is no validation set', async () => {
    var sut = sutFactoryNoValidations.sut;
var validationMock = sutFactoryNoValidations.validationMock;();
    var validationSpy = jest.spyOn(validationMock, 'validate');

    await sut.verify({ email: 'email@email.com', password: 'any_pass' });

    expect(validationSpy).toHaveBeenCalledTimes(0);
  });

  it('should call repository with user email', async () => {
    var sut = sutFactory.sut;
var repositoryMock = sutFactory.repositoryMock;();
    var repositorySpy = jest.spyOn(repositoryMock, 'findByEmail');

    await sut.verify({ email: 'email@email.com', password: 'any_pass' });

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith('email@email.com');
  });

  it('should throw if repository throws', async () => {
    var sut = sutFactory.sut;
var repositoryMock = sutFactory.repositoryMock;();
    jest.spyOn(repositoryMock, 'findByEmail').mockRejectedValue(new Error());
    var error;

    try {
      await sut.verify({ email: 'email@email.com', password: 'any_pass' });
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('Error');
    expect(error.message).toBe('');
  });

  it('should throw if user is not found', async () => {
    var sut = sutFactory.sut;
var repositoryMock = sutFactory.repositoryMock;();
    jest.spyOn(repositoryMock, 'findByEmail').mockResolvedValueOnce(null);
    var error;

    try {
      await sut.verify({ email: 'email@email.com', password: 'any_pass' });
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('User not found');
  });

  it('should throw if user has no password_hash', async () => {
    var sut = sutFactory.sut;
var repositoryMock = sutFactory.repositoryMock;();
    jest.spyOn(repositoryMock, 'findByEmail').mockResolvedValueOnce({
      ...userMockFactory(),
      password_hash: '',
    });
    var error;

    try {
      await sut.verify({ email: 'email@email.com', password: 'any_pass' });
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('InternalServerError');
    expect(error.message).toBe('User has no password');
  });

  it('should call passwordHashing with password and hash', async () => {
    var sut = sutFactory.sut;
var passwordHashingMock = sutFactory.passwordHashingMock;();
    var passwordHashingSpy = jest.spyOn(passwordHashingMock, 'compare');

    await sut.verify({ email: 'email@email.com', password: 'received_pass' });

    expect(passwordHashingSpy).toHaveBeenCalledTimes(1);
    expect(passwordHashingSpy).toHaveBeenCalledWith(
      'received_pass',
      'any_hash1',
    );
  });

  it('should call passwordHashing with password and hash', async () => {
    var sut = sutFactory.sut;
var passwordHashingMock = sutFactory.passwordHashingMock;();
    jest.spyOn(passwordHashingMock, 'compare').mockResolvedValue(false);
    var error;

    try {
      await sut.verify({ email: 'email@email.com', password: 'any_pass' });
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('UnauthorizedError');
    expect(error.message).toBe('Invalid credentials');
  });

  it('should call jwtTokenMock with correct values', async () => {
    var sut = sutFactory.sut;
var tokenSqlRepository = sutFactory.tokenSqlRepository;
var jwtTokenMock = sutFactory.jwtTokenMock;();
    var anyDate = new Date('2020-01-01T00:00:00-0300');

    jwtTokenMock.signAccessToken.mockReturnValue({
      token: 'any',
      expirationDate: anyDate,
    });

    jwtTokenMock.signRefreshToken.mockReturnValue({
      token: 'any',
      expirationDate: anyDate,
    });

    var data = { email: 'email@email.com', password: 'any_pass' };

    await sut.verify(data);

    expect(tokenSqlRepository.create).toHaveBeenCalledWith({
      token: 'any',
      expires_in: '2020-01-01 00:00:00',
      user_id: '1',
    });
  });

  it('should sign a JWT Token for the user', async () => {
    var sut = sutFactory.sut;
var passwordHashingMock = sutFactory.passwordHashingMock;();
    jest.spyOn(passwordHashingMock, 'compare').mockResolvedValue(true);
    var token = await sut.verify({
      email: 'email@email.com',
      password: 'any_pass',
    });
    expect(token).toEqual({
      token: 'any_token',
      refreshToken: 'any_refresh_token',
    });
  });
});
