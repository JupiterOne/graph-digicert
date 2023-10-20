import {
  Entity,
  assignTags,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from './steps/constants';
import {
  DigiCertAccount,
  DigiCertDomain,
  DigiCertOrder,
  DigiCertUser,
} from './types';

function createEntityKey(type: string, id: number | string): string {
  return `${type}:${id}`;
}

export const createAccountEntity = (
  account: DigiCertAccount,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: createEntityKey(Entities.ACCOUNT._type, account.id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: account.id.toString(),
        name: account.id.toString(),
        accountId: account.id,
        displayName: `DigiCert:${account.id}`,
        adminEmail: account.admin_email?.includes(',')
          ? account.admin_email.split(',').map((e) => e.trim())
          : account.admin_email,
      },
    },
  });

export const createUserEntity = (
  data: DigiCertUser,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createEntityKey(
          Entities.USER._type,
          `${data.account_id}:${data.id}`,
        ),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: `${data.account_id}:${data.id}`,
        accountId: data.account_id,
        userId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        name: `${data.first_name} ${data.last_name}`,
        status: data.status,
        active: data.status === 'active',
        displayName: data.email,
        email: data.email,
        phone: data.telephone,
        jobTitle: data.job_title,
        type: data.type,
        roles: data.access_roles?.map((r) => r.name),
        admin:
          data.access_roles?.find((r) => r.name === 'Administrator') !==
          undefined,
      },
    },
  });

export const createDomainEntity = (
  data: DigiCertDomain,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createEntityKey(
          Entities.DOMAIN._type,
          `${data.organization.id}:${data.id}`,
        ),
        _type: Entities.DOMAIN._type,
        _class: Entities.DOMAIN._class,
        id: `${data.organization.id}:${data.id}`,
        domainId: data.id,
        name: data.name,
        active: data.is_active,
        displayName: data.name,
        organization: data.organization.name,
        organizationId: data.organization.id,
        createdOn: parseTimePropertyValue(data.date_created),
        expiresOn: parseTimePropertyValue(data.dcv_expiration?.ov),
      },
    },
  });

export const createOrderEntity = (data: DigiCertOrder): Entity => {
  const entity = createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createEntityKey(Entities.CERTIFICATE._type, data.id),
        _type: Entities.CERTIFICATE._type,
        _class: Entities.CERTIFICATE._class,
        id: data.id.toString(),
        orderId: data.id,
        certificateId: data.certificate.id,
        name: data.certificate.common_name,
        domainName: data.certificate.common_name,
        displayName: data.certificate.common_name,
        dnsNames: data.certificate.dns_names,
        alternativeNames: data.certificate.dns_names,
        active:
          data.certificate.days_remaining &&
          data.certificate.days_remaining > 0,
        signatureHash: data.certificate.signature_hash,
        type: data.product.type,
        productName: data.product.name,
        productId: data.product.name_id,
        validityYears: data.validity_years,
        hasDuplicates: data.has_duplicates,
        renewed: data.is_renewed,
        renewalNotification: !data.disable_renewal_notifications,
        status: data.status,
        issuedOn:
          data.status === 'issued' && parseTimePropertyValue(data.date_created),
        createdOn: parseTimePropertyValue(data.date_created),
        expiresOn: parseTimePropertyValue(data.certificate.valid_till),
      },
    },
  });

  assignTags(
    entity,
    data.custom_fields?.map(({ label, value }) => ({
      Key: label,
      Value: value,
    })),
  );

  return entity;
};
