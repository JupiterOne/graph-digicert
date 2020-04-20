import { Domain } from '../collector';
import { createIntegrationEntity, getTime } from '@jupiterone/integration-sdk';
import createEntityKey from './utils/createEntityKey';

export const convertDomain = (
  domain: Domain,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: domain,
      assign: {
        _key: createEntityKey('certificate', domain.id),
        _type: 'digicert_domain_certificate',
        _class: 'Certificate',
        id: domain.id.toString(),
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
