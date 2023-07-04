import path from 'path';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const time = 100;
const intervalsCount = 4;
const fakePathToFile = 'somePath/fileName.txt';
const fakeFileContent = 'Fake file content';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    const mockCallback = jest.fn();
    doStuffByTimeout(mockCallback, time);
    expect(mockSetTimeout).toBeCalledTimes(1);
    expect(mockSetTimeout).toBeCalledWith(mockCallback, time);
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    doStuffByTimeout(mockCallback, time);
    expect(mockCallback).not.toBeCalled();
    jest.advanceTimersByTime(time);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockSetInterval = jest.spyOn(global, 'setInterval');
    const mockCallback = jest.fn();
    doStuffByInterval(mockCallback, time);
    expect(mockSetInterval).toBeCalled();
    expect(mockSetInterval).toHaveBeenCalledWith(mockCallback, time);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    doStuffByInterval(mockCallback, time);
    jest.advanceTimersByTime(time * intervalsCount);
    expect(mockCallback).toBeCalledTimes(intervalsCount);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockPathJoin = jest.spyOn(path, 'join');
    readFileAsynchronously(fakePathToFile).then(() => {
      expect(mockPathJoin).toBeCalled;
      expect(mockPathJoin).toBeCalledWith(__dirname, fakePathToFile);
    });
  });

  test('should return null if file does not exist', async () => {
    readFileAsynchronously(fakePathToFile).then((result) => {
      expect(result).toBeNull();
    });
  });

  test('should return file content if file exists', async () => {
    const mockFsExistSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => true);
    const mockFsReadFile = jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(fakeFileContent));
    readFileAsynchronously(fakePathToFile)
      .then((result) => {
        expect(result).toEqual(fakeFileContent);
      })
      .finally(() => {
        mockFsExistSync.mockRestore();
        mockFsReadFile.mockRestore();
      });
  });
});
