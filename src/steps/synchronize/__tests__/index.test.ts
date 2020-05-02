/* eslint-disable @typescript-eslint/camelcase */
import { createStepContext } from 'test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk/testing';
import nodeFetch from 'node-fetch';
import fetchMock from 'jest-fetch-mock';

import step from '../index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should fetch api keys and generate account entity from the result', async () => {
  recording = setupRecording({
    name: 'account',
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
      _type: 'digicert_user',
      _class: ['User'],
      email: 'e@z.com',
      firstName: 'Erkang',
      admin: true,
    }),
  ]);
});

test('should process order entities', async () => {
  fetchMock.mockIf(
    /^https?:\/\/www.digicert.com\/services\/v2.*$/,
    async (req) => {
      if (req.url.endsWith('/account')) {
        return "{\"id\":1449471,\"primary_organization_name\":\"Erkang, LLC\",\"primary_organization_country\":\"us\",\"make_renewal_calls\":true,\"express_install_enabled\":false,\"display_rep\":true,\"balance_negative_limit\":0,\"root_container_id\":357777,\"cert_transparency\":\"embed\",\"cert_central_type\":\"retail\",\"billing_account_id\":1449471,\"billing_account_name\":\"Erkang, LLC\",\"language_id\":1,\"migrated\":false,\"has_auth_key\":false}";
      } else if (req.url.endsWith('/order/certificate')) {
        return JSON.stringify({
          orders: [
            {
              id: 123456,
              certificate: {
                id: 104,
                common_name: 'example.com',
                dns_names: ['example2.com', 'example3.com'],
                signature_hash: 'sha256',
              },
              status: 'pending',
              is_renewed: false,
              date_created: '2018-10-16T17:29:56+00:00',
              organization: {
                id: 112233,
                name: 'Epigyne Unwieldiness llc',
              },
              validity_years: 1,
              disable_renewal_notifications: false,
              container: {
                id: 14,
                name: 'DigiCert Inc.',
              },
              product: {
                name_id: 'ssl_plus',
                name: 'Standard SSL',
                type: 'ssl_certificate',
              },
              has_duplicates: false,
              product_name_id: 'ssl_plus',
            },
            {
              id: 123457,
              certificate: {
                id: 105,
                common_name: 'example.org',
                dns_names: ['sub.example.org'],
                valid_till: '2020-04-30',
                days_remaining: 289,
                signature_hash: 'sha256',
              },
              status: 'issued',
              is_renewed: false,
              date_created: '2019-04-30T18:02:50+00:00',
              organization: [],
              validity_years: 1,
              container: {
                id: 14,
                name: 'CertCentral',
              },
              product: {
                name_id: 'ssl_dv_geotrust',
                name: 'GeoTrust Standard DV',
                type: 'dv_ssl_certificate',
              },
              has_duplicates: false,
              product_name_id: 'ssl_dv_geotrust',
            },
          ],
          page: {
            total: 2,
            limit: 0,
            offset: 0,
          },
        });
      } else if (req.url.endsWith('/user')) {
        return '{}';
      } else {
        return {
          status: 404,
          body: 'Not Found',
        };
      }
    },
  );

  const fetchSpy = jest.spyOn(nodeFetch, 'default');

  const context = createStepContext();
  await step.executionHandler(context);

  expect(fetchSpy).toHaveBeenCalledTimes(3);
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://www.digicert.com/services/v2/order/certificate',
    expect.any(Object),
  );

  expect(context.jobState.collectedEntities).toHaveLength(3);
  expect(context.jobState.collectedRelationships).toHaveLength(2);

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
      id: '123456',
      status: 'pending',
      _key: 'digicert_certificate:123456',
      _type: 'digicert_certificate',
      _class: ['Certificate'],
      orderId: 123456,
      certificateId: 104,
      name: 'example.com',
      domainName: 'example.com',
      displayName: 'example.com',
      dnsNames: ['example2.com', 'example3.com'],
      alternativeNames: ['example2.com', 'example3.com'],
      active: false,
      signatureHash: 'sha256',
      type: 'ssl_certificate',
      productName: 'Standard SSL',
      productId: 'ssl_plus',
      validityYears: 1,
      hasDuplicates: false,
      renewed: false,
      renewalNotification: true,
      issuedOn: false,
      createdOn: 1539710996000,
    }),
    expect.objectContaining({
      id: '123457',
      status: 'issued',
      _key: 'digicert_certificate:123457',
      _type: 'digicert_certificate',
      _class: ['Certificate'],
      orderId: 123457,
      certificateId: 105,
      name: 'example.org',
      domainName: 'example.org',
      displayName: 'example.org',
      dnsNames: ['sub.example.org'],
      alternativeNames: ['sub.example.org'],
      active: true,
      signatureHash: 'sha256',
      type: 'dv_ssl_certificate',
      productName: 'GeoTrust Standard DV',
      productId: 'ssl_dv_geotrust',
      validityYears: 1,
      hasDuplicates: false,
      renewed: false,
      renewalNotification: true,
      issuedOn: 1556647370000,
      createdOn: 1556647370000,
      expiresOn: 1588204800000,
    }),
  ]);
});
