import { DigiCertDomain, DigiCertAccount, DigiCertOrder } from '../collector';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk';
import createEntityKey from './utils/createEntityKey';

export const convertAccount = (
  account: DigiCertAccount,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        ...convertProperties(account),
        _key: createEntityKey('digicert_account', account.id),
        _type: 'digicert_account',
        _class: 'Account',
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

export const convertDomain = (
  data: DigiCertDomain,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createEntityKey(
          'digicert_domain',
          `${data.organization.id}:${data.id}`,
        ),
        _type: 'digicert_domain',
        _class: 'Domain',
        id: `${data.organization.id}:${data.id}`,
        domainId: data.id,
        name: data.name,
        active: data.is_active,
        displayName: data.name,
        organization: data.organization.name,
        organizationId: data.organization.id,
        createdOn: getTime(data.date_created),
        expiresOn: getTime(data.dcv_expiration?.ov),
      },
    },
  });

export const convertOrder = (
  data: DigiCertOrder,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createEntityKey('digicert_certificate', data.id),
        _type: 'digicert_certificate',
        _class: 'Certificate',
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
        issuedOn: data.status === 'issued' && getTime(data.date_created),
        createdOn: getTime(data.date_created),
        expiresOn: getTime(data.certificate.valid_till),
      },
    },
  });
