import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

const initialAccountBalance = 500;
const wrongSum = initialAccountBalance + 100;
const sumToDeposit = 100;
const sumToWithdraw = 100;
const sumToTransfer = 100;
const fetchBalanceValue = 333;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(initialAccountBalance);
    expect(account.getBalance()).toEqual(initialAccountBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(initialAccountBalance);
    expect(() => account.withdraw(wrongSum)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(initialAccountBalance);
    const otherAccount = getBankAccount(initialAccountBalance);
    expect(() => account.transfer(wrongSum, otherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(initialAccountBalance);
    expect(() => account.transfer(wrongSum, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(initialAccountBalance);
    expect(account.deposit(sumToDeposit).getBalance()).toEqual(
      initialAccountBalance + sumToDeposit,
    );
  });

  test('should withdraw money', () => {
    const account = getBankAccount(initialAccountBalance);
    expect(account.withdraw(sumToWithdraw).getBalance()).toEqual(
      initialAccountBalance - sumToWithdraw,
    );
  });

  test('should transfer money', () => {
    const account = getBankAccount(initialAccountBalance);
    const otherAccount = getBankAccount(initialAccountBalance);

    expect(account.transfer(sumToTransfer, otherAccount).getBalance()).toEqual(
      initialAccountBalance - sumToTransfer,
    );
    expect(otherAccount.getBalance()).toEqual(
      initialAccountBalance + sumToTransfer,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(initialAccountBalance);
    return account.fetchBalance().then((data) => {
      if (data !== null) expect(typeof data).toBe('number');
    });
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(initialAccountBalance);
    const mockFetchBalance = jest
      .spyOn(account, 'fetchBalance')
      .mockImplementation(() => Promise.resolve(fetchBalanceValue));

    account
      .synchronizeBalance()
      .then(() => account.getBalance())
      .then((balance) => expect(balance).toEqual(fetchBalanceValue))
      .finally(() => mockFetchBalance.mockRestore());
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(initialAccountBalance);
    const mockFetchBalance = jest
      .spyOn(account, 'fetchBalance')
      .mockImplementation(() => Promise.resolve(null));

    account
      .synchronizeBalance()
      .catch((error) =>
        expect(error).toBeInstanceOf(SynchronizationFailedError),
      )
      .finally(() => mockFetchBalance.mockRestore());
  });
});
