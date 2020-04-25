import { Domain, Account } from '../collector';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk';
import createEntityKey from './utils/createEntityKey';

export const convertAccount = (
  account: Account,
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

export const convertDomain = (
  domain: Domain,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: domain,
      assign: {
        _key: createEntityKey('digicert_domain_certificate', domain.id),
        _type: 'digicert_domain_certificate',
        _class: 'Certificate',
        domainId: domain.id,
        name: domain.name,
        active: domain.is_active,
        displayName: domain.name,
        createdOn: getTime(domain.date_created),
        expiresOn: domain.dcv_expiration?.ov
          ? getTime(domain.dcv_expiration?.ov)
          : undefined,
      },
    },
  });
