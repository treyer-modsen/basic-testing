import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

const unmockedFnText = 'I am not mocked';

jest.mock('./index', () => ({
  ...jest.requireActual<typeof import('./index')>('./index'),
  mockOne: jest.fn(),
  mockTwo: jest.fn(),
  mockThree: jest.fn(),
}));

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const mockedConsoleLog = jest.spyOn(console, 'log');
    mockOne();
    mockTwo();
    mockThree();
    expect(mockedConsoleLog).toHaveBeenCalledTimes(0);
    mockedConsoleLog.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const mockedConsoleLog = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockedConsoleLog).toHaveBeenCalledWith(unmockedFnText);
    mockedConsoleLog.mockRestore();
  });
});
