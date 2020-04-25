import { DigiCertDomain, DigiCertAccount } from '../collector';
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
        accountId: account.id,
        displayName: account.id.toString(),
        adminEmail: account.admin_email.includes(',')
          ? account.admin_email.split(',').map((e) => e.trim())
          : account.admin_email,
      },
    },
  });

export const convertDomainCertificate = (
  domain: DigiCertDomain,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: domain,
      assign: {
        _key: createEntityKey(
          'digicert_domain_certificate',
          `${domain.organization.id}:${domain.id}`,
        ),
        _type: 'digicert_domain_certificate',
        _class: 'Certificate',
        id: `${domain.organization.id}:${domain.id}`,
        domainId: domain.id,
        name: domain.name,
        active: domain.is_active,
        displayName: domain.name,
        organization: domain.organization.name,
        organizationId: domain.organization.id,
        createdOn: getTime(domain.date_created),
        expiresOn: domain.dcv_expiration?.ov
          ? getTime(domain.dcv_expiration?.ov)
          : undefined,
      },
    },
  });
