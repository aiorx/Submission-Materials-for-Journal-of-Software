var DepositInput = require('./deposit/deposit.in').DepositInput;
var DepositInteractor = require('./deposit/deposit.interactor').DepositInteractor;
var DepositOutput = require('./deposit/deposit.out').DepositOutput;
var SignupInput = require('./signup/signup.in').SignupInput;
var SignupInteractor = require('./signup/signup.interactor').SignupInteractor;
var SignupOutput = require('./signup/signup.out').SignupOutput;
var TransferInput = require('./transfer/transfer.in').TransferInput;
var TransferInteractor = require('./transfer/transfer.interactor').TransferInteractor;
var TransferOutput = require('./transfer/transfer.out').TransferOutput;

class App {
  constructor(
    private signupInteractor: SignupInteractor,
    private depositInteractor: DepositInteractor,
    private transferInteractor: TransferInteractor,
  ) {}

  async signUp(signupInput: SignupInput): Promise<SignupOutput> {
    return await this.signupInteractor.execute(signupInput);
  }

  async deposit(depositInput: DepositInput): Promise<DepositOutput> {
    return await this.depositInteractor.execute(depositInput);
  }

  async transfer(transferInput: TransferInput): Promise<TransferOutput> {
    return await this.transferInteractor.execute(transferInput);
  }
}
