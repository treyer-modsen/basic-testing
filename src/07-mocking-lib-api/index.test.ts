import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const baseUrlOption = {
  baseURL: 'https://jsonplaceholder.typicode.com',
};
const relativePath = '/some/path';
const data = { key: 'someValue' };

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data }),
    });
    throttledGetDataFromApi(relativePath)?.then(() => {
      expect(axios.create).toHaveBeenCalledWith(baseUrlOption);
    });
  });

  test('should perform request to correct provided url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data }),
    });
    throttledGetDataFromApi(relativePath)?.then(() => {
      jest.runAllTimers();
      expect(axios.create().get).toHaveBeenCalledWith(relativePath);
    });
  });

  test('should return response data', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data }),
    });
    throttledGetDataFromApi(relativePath)?.then((result) => {
      expect(result).toBe(data);
    });
  });
});
