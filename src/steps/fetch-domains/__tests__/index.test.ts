import { createStepContext } from 'test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk/testing';

import step from '../index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should fetch api keys and generate entities from the results', async () => {
  recording = setupRecording({
    name: 'domains',
    directory: __dirname,
    redactedRequestHeaders: ['api-key', 'x-dc-devkey'],
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(2);
  expect(context.jobState.collectedRelationships).toHaveLength(1);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'digicert_account:1449471',
      _type: 'digicert_account',
      _class: ['Account'],
      name: '1449471',
      accountId: 1449471,
      displayName: 'DigiCert:1449471',
    }),
    expect.objectContaining({
      id: '894410:1587137',
      name: 'erkang.com',
      _key: 'digicert_domain_certificate:894410:1587137',
      _type: 'digicert_domain_certificate',
      _class: ['Certificate'],
      domainId: 1587137,
      active: true,
      displayName: 'erkang.com',
      organization: 'Erkang, LLC',
      organizationId: 894410,
      createdOn: 1587915167000,
      expiresOn: 1659139200000,
    }),
  ]);
});
