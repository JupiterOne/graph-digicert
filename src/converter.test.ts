import { createOrderEntity } from './converter';

test('should create order entity', () => {
  const orderEntity = createOrderEntity({
    id: 42,
    certificate: {
      id: 4242,
      common_name: 'foo.bar.com',
      dns_names: ['foo.bar.com'],
      valid_till: '2024-01-01',
      days_remaining: 363,
      signature_hash: 'sha512',
    },
    status: 'active',
    is_renewed: true,
    date_created: '2020-01-01T00:00:00Z',
    organization: {
      id: 42,
      name: '42',
      status: 'active',
      display_name: 'DigiCert',
      is_active: 'true',
    },
    validity_years: 1,
    disable_renewal_notifications: false,
    container: {
      id: 42,
      name: '42',
    },
    product: {
      name_id: '42',
      name: 'foo',
      type: 'bar',
    },
    has_duplicates: true,
    product_name_id: '4242',
    custom_fields: [
      {
        metadata_id: 42,
        label: 'foo',
        value: '42',
      },
      {
        metadata_id: 4242,
        label: 'bar',
        value: 'bar-42',
      },
    ],
  });

  expect(orderEntity).toMatchObject({
    _class: ['Certificate'],
    _key: 'digicert_certificate:42',
    _type: 'digicert_certificate',
    active: true,
    alternativeNames: ['foo.bar.com'],
    certificateId: 4242,
    createdOn: 1577836800000,
    displayName: 'foo.bar.com',
    dnsNames: ['foo.bar.com'],
    domainName: 'foo.bar.com',
    expiresOn: 1704067200000,
    hasDuplicates: true,
    id: '42',
    issuedOn: false,
    name: 'foo.bar.com',
    orderId: 42,
    productId: '42',
    productName: 'foo',
    renewalNotification: true,
    renewed: true,
    signatureHash: 'sha512',
    status: 'active',
    'tag.bar': 'bar-42',
    'tag.foo': 42,
    type: 'bar',
    validityYears: 1,
  });
});
