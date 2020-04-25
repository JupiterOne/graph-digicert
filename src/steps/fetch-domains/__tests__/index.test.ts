import { Polly, setupPolly, createStepContext } from 'test';

import step from '../index';

let polly: Polly;

afterEach(async () => {
  await polly.stop();
});

test('should fetch api keys and generate entities from the results', async () => {
  polly = setupPolly(__dirname, 'domains');

  const context = createStepContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(1);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _class: ['Certificate'],
      _type: 'digicert_domain_certificate',
      _key: 'digicert-certificate:1564602',
      name: 'test.com',
      active: true,
      displayName: 'test.com',
      domainId: 1564602,
      organization: 'Test Company',
      organizationId: 887858,
      createdOn: 1587412402000,
      expiresOn: 1658620800000,
    }),
  ]);
});
