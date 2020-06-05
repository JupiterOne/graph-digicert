import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

import validateInvocation from '../validateInvocation';

import fetchMock from 'jest-fetch-mock';
import { DigiCertIntegrationInstanceConfig } from '../types';

beforeEach(() => {
  fetchMock.doMock();
});

test('rejects if apiKey is not present', async () => {
  fetchMock.mockResponse('{}');

  const context = createMockExecutionContext<
    DigiCertIntegrationInstanceConfig
  >();
  context.instance.config = {} as DigiCertIntegrationInstanceConfig;

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate/,
  );
});

test('rejects if unable to hit provider apis', async () => {
  fetchMock.mockResponse(() =>
    Promise.resolve({
      status: 403,
      body: 'Unauthorized',
    }),
  );

  const context = createMockExecutionContext<
    DigiCertIntegrationInstanceConfig
  >();
  context.instance.config = { apiKey: 'test' };

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate/,
  );
});

test('performs sample list computers call to ensure api can be hit', async () => {
  fetchMock.mockResponse(JSON.stringify({ computers: [] }));

  const context = createMockExecutionContext<
    DigiCertIntegrationInstanceConfig
  >();
  context.instance.config = { apiKey: 'test' };

  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
