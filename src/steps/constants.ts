import { RelationshipClass } from '@jupiterone/data-model';

export const StepIds = {
  FETCH_ACCOUNT: 'fetch-account',
  FETCH_USERS: 'fetch-users',
  FETCH_ORDERS: 'fetch-orders',
};

export const Entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'digicert_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'digicert_user',
    _class: ['User'],
  },
  DOMAIN: {
    // no longer produced by integration
    resourceName: 'Domain',
    _type: 'digicert_domain',
    _class: ['Domain'],
  },
  CERTIFICATE: {
    resourceName: 'User',
    _type: 'digicert_certificate',
    _class: ['Certificate'],
  },
};

export const Relationships = {
  ACCOUNT_HAS_USER: {
    _type: 'digicert_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_DOMAIN: {
    // no longer produced by integration
    _type: 'digicert_account_has_domain',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DOMAIN._type,
  },
  ACCOUNT_HAS_CERTIFICATE: {
    _type: 'digicert_account_has_certificate',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CERTIFICATE._type,
  },
};
