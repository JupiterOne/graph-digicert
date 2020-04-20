import { createServicesClient } from '../index';

test('creates a ServicesClient using the api key from the integration instance', () => {
  const client = createServicesClient({
    id: 'test-integration-instance',
    accountId: 'Your account',
    name: 'Test Integration',
    integrationDefinitionId: 'test-integration-definition',
    description: 'A generated integration instance just for this test',
    config: {
      apiKey: 'my-api-key',
    },
  });

  expect(client.requiredHeaders).toEqual({
    'X-DC-DEVKEY': 'my-api-key',
  });
});
