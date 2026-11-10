import Account from "../src/Account.js";

describe("Account class", () => {
    it("should create a new instance of the Account class", () => {
        // Act
        const account = new Account();
        // Assert
        expect(account).toBeInstanceOf(Account);
    });

    it("should have a unique ID that is incremented on each instance of the Account class", () => {
        // Act
        const account1 = new Account();
        const account2 = new Account();
        // Assert
        expect(account1.getId()).toBe(1001);
        expect(account2.getId()).toBe(1002);
    });

    describe("getBalance function", () => {
        it("should return the balance stored in the account", () => {
            // Act
            const account = new Account();
            // Assert
            expect(account.getBalance()).toEqual(0);
        });
    });

    // Assisted using common GitHub development utilities--------
    describe("deposit function", () => {
        it("should add the amount from a transaction to the balance", () => {
            // Arrange
            const account = new Account();
            const mockTransaction = jasmine.createSpyObj(`transaction`, { getAmount: 100 });
            // Act
            account.deposit(mockTransaction);
            // Assert
            expect(account.getBalance()).toEqual(100);
        });
        // ------------------------

        it("should return a console.log indicating the deposit was successful", () => {
            // Arrange
            const account = new Account();
            const logSpy = spyOn(console, `log`);
            const mockTransaction = jasmine.createSpyObj(`transaction`, { getAmount: 100 });
            // Act
            account.deposit(mockTransaction);
            // Assert
            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy).toHaveBeenCalledWith(
                `Successfully Deposited £${mockTransaction.getAmount()}`
            );
        });

        it("should throw an error if the input is less than 1 or not a number/float", () => {
            // Arrange
            const account = new Account();
            const mockTransaction1 = jasmine.createSpyObj(`transaction`, { getAmount: -100 });
            const mockTransaction2 = jasmine.createSpyObj(`transaction`, { getAmount: `hello` });
            const mockTransaction3 = jasmine.createSpyObj(`transaction`, { getAmount: 0 });
            // Act
            // Assert
            expect(() => account.deposit(mockTransaction1)).toThrowError(
                `Please enter a number greater than 0`
            );
            expect(() => account.deposit(mockTransaction2)).toThrowError(
                `Please enter a number greater than 0`
            );
            expect(() => account.deposit(mockTransaction3)).toThrowError(
                `Please enter a number greater than 0`
            );
            expect(account.getBalance()).toEqual(0);
        });

        // Assisted using common GitHub development utilities--------
        it("should add the amount to the balance when depositing multiple times", () => {
            // Arrange
            const account = new Account();
            const mockTransaction1 = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            const mockTransaction2 = jasmine.createSpyObj(`transaction`, { getAmount: 75.2 });
            const mockTransaction3 = jasmine.createSpyObj(`transaction`, { getAmount: 100.55 });
            // Act
            account.deposit(mockTransaction1);
            account.deposit(mockTransaction2);
            account.deposit(mockTransaction3);
            // Assert
            expect(account.getBalance()).toEqual(225.75);
        });

        it("should return a console.log indicating the deposit was successful when depositing multiple times", () => {
            // Arrange
            const account = new Account();
            const logSpy = spyOn(console, `log`);
            const mockTransaction1 = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            const mockTransaction2 = jasmine.createSpyObj(`transaction`, { getAmount: 75 });
            const mockTransaction3 = jasmine.createSpyObj(`transaction`, { getAmount: 100 });
            // Act
            account.deposit(mockTransaction1);
            account.deposit(mockTransaction2);
            account.deposit(mockTransaction3);
            // Assert
            expect(logSpy).toHaveBeenCalledTimes(3);
            expect(logSpy).toHaveBeenCalledWith(`Successfully Deposited £50`);
            expect(logSpy).toHaveBeenCalledWith(`Successfully Deposited £75`);
            expect(logSpy).toHaveBeenCalledWith(`Successfully Deposited £100`);
        });
        // ----------------------------
    });

    describe("withdraw function", () => {
        it("should remove the amount given from the balance and return a success log", () => {
            // Arrange
            const account = new Account();
            const logSpy = spyOn(console, `log`);
            const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 100 });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            // Act
            account.deposit(mockDeposit);
            account.withdraw(mockWithdrawal);
            // Assert
            expect(logSpy).toHaveBeenCalledTimes(3);
            expect(logSpy).toHaveBeenCalledWith(`Successfully Withdrew £50`);
            expect(logSpy).toHaveBeenCalledWith(`Remaining Balance: £50`);
            expect(account.getBalance()).toEqual(50);
        });

        it("should throw an error if attempting to withdraw more than the balance", () => {
            // Arrange
            const account = new Account();
            const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 100 });
            account.deposit(mockDeposit);
            // Assert
            expect(() => account.withdraw(mockWithdrawal)).toThrowError(`Insufficient funds`);
        });

        it("should throw an error if the input is less than 1 or not a number/float", () => {
            // Arrange
            const account = new Account();
            const mockWithdrawal1 = jasmine.createSpyObj(`transaction`, { getAmount: -100 });
            const mockWithdrawal2 = jasmine.createSpyObj(`transaction`, { getAmount: "string" });
            // Assert
            expect(() => account.withdraw(mockWithdrawal1)).toThrowError(
                `Please enter a number greater than 0`
            );
            expect(() => account.withdraw(mockWithdrawal2)).toThrowError(
                `Please enter a number greater than 0`
            );
        });
    });

    describe("getTransactions function", () => {
        it("should return an array of transactions", () => {
            // Arrange
            const account = new Account();
            const mockDeposit = jasmine.createSpyObj(`transaction`, {
                getAmount: 100,
                getType: "credit",
                getDate: new Date(),
                getBalance: 0,
                getId: 1001,
            });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, {
                getAmount: 50,
                getType: "debit",
                getDate: new Date(),
                getBalance: 100,
                getId: 1002,
            });
            // Act
            account.deposit(mockDeposit);
            account.withdraw(mockWithdrawal);
            // Assert
            let transactions = account.getTransactions();
            expect(transactions.length).toEqual(2);
            expect(transactions[0]).toEqual(mockDeposit);
            expect(transactions[1]).toEqual(mockWithdrawal);
        });
    });

    describe("overdraft", () => {
        describe("setOverdraft function", () => {
            it("should be able to enable an overdraft set at the given number", () => {
                // Arrange
                const account = new Account();
                // Act
                account.setOverdraft(100);
                // Assert
                expect(account.getOverdraft()).toEqual(100);
                expect(account.getOverdraftEnabled()).toEqual(true);
            });

            it("should not set an overdraft if the input is not a number or negative", () => {
                // Arrange
                const account = new Account();
                // Act
                account.setOverdraft(-100);
                account.setOverdraft(`string`);
                // Assert
                expect(account.getOverdraft()).toEqual(0);
                expect(account.getOverdraftEnabled()).toEqual(false);
            });

            it("should set the overdraft to false and limit to 0 if given an argument of false", () => {
                // Arrange
                const account = new Account();
                account.setOverdraft(100);
                // Act
                account.setOverdraft(false);
                // Assert
                expect(account.getOverdraft()).toEqual(0);
                expect(account.getOverdraftEnabled()).toEqual(false);
            });

            it("should return a warning if set to false when the user is currently in their overdraft", () => {
                const account = new Account();
                account.setOverdraft(100);
                const logSpy = spyOn(console, `log`);
                const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
                const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 150 });
                // Act
                account.deposit(mockDeposit);
                account.withdraw(mockWithdrawal);
                account.setOverdraft(false);
                // Assert
                expect(logSpy).toHaveBeenCalledTimes(4);
                expect(account.getOverdraft()).toEqual(100);
                expect(logSpy).toHaveBeenCalledWith(
                    `You are currently in your overdraft, please deposit funds before disabling`
                );
            });

            it("should return a warning if set to a lower number the user is currently in their overdraft", () => {
                const account = new Account();
                account.setOverdraft(100);
                const logSpy = spyOn(console, `log`);
                const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
                const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 150 });
                // Act
                account.deposit(mockDeposit);
                account.withdraw(mockWithdrawal);
                account.setOverdraft(50);
                // Assert
                expect(logSpy).toHaveBeenCalledTimes(4);
                expect(account.getOverdraft()).toEqual(100);
                expect(logSpy).toHaveBeenCalledWith(
                    `You cannot set an overdraft limit lower than your current balance`
                );
            });
        });

        it("should allow the user to withdraw up to their limit", () => {
            // Arrange
            const account = new Account();
            account.setOverdraft(100);
            const logSpy = spyOn(console, `log`);
            const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 150 });
            // Act
            account.deposit(mockDeposit);
            account.withdraw(mockWithdrawal);
            // Assert

            expect(account.getBalance()).toEqual(-100);
            expect(logSpy).toHaveBeenCalledTimes(3);
            expect(logSpy).toHaveBeenCalledWith(`Successfully Withdrew £150`);
        });

        it("should not allow the user to withdraw more than their limit", () => {
            // Arrange
            const account = new Account();
            account.setOverdraft(100);
            const mockDeposit = jasmine.createSpyObj(`transaction`, { getAmount: 50 });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, { getAmount: 200 });
            // Act
            account.deposit(mockDeposit);
            // Assert
            expect(() => account.withdraw(mockWithdrawal)).toThrowError(`Insufficient funds`);
        });
    });

    describe("printStatement function", () => {
        it("should print a statement of all transactions", () => {
            // Arrange
            const account = new Account();
            const mockDeposit = jasmine.createSpyObj(`transaction`, {
                getAmount: 100,
                getType: "credit",
                getDate: new Date().toLocaleDateString("en-GB"),
                getBalance: 0,
            });
            const mockWithdrawal = jasmine.createSpyObj(`transaction`, {
                getAmount: 50,
                getType: "debit",
                getDate: new Date().toLocaleDateString("en-GB"),
                getBalance: 100,
            });
            const logSpy = spyOn(console, `log`);
            // Act
            account.deposit(mockDeposit);
            account.withdraw(mockWithdrawal);
            // Assert
            account.printStatement();
            expect(logSpy).toHaveBeenCalledTimes(6);
        });
    });
});
