import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { convertAccount, convertOrder, convertUser } from '../../converter';
import { DigiCertIntegrationInstanceConfig } from 'src/types';

const step: IntegrationStep = {
  id: 'synchronize',
  name: 'Fetch DigiCert Objects',
  types: [
    'digicert_account',
    'digicert_user',
    'digicert_domain',
    'digicert_certificate',
    'digicert_account_has_user',
    'digicert_account_has_domain',
    'digicert_account_has_certificate',
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext<DigiCertIntegrationInstanceConfig>) {
    const client = createServicesClient(instance);

    const account = await client.getAccountDetails();
    const accountEntity = convertAccount(account);
    await jobState.addEntities([accountEntity]);

    // TODO: Need to add pagination here, default returned/max is 1000
    const { orders } = await client.iterateOrders();
    const orderEntities = orders ? orders.map(convertOrder) : [];
    await jobState.addEntities(orderEntities);

    const { users } = await client.iterateUsers();
    const userEntities = users ? users.map(convertUser) : [];
    await jobState.addEntities(userEntities);

    const accountOrderRelationships = orderEntities.map((orderEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: orderEntity,
        _class: 'HAS',
      }),
    );
    await jobState.addRelationships(accountOrderRelationships);

    const accountUserRelationships = userEntities.map((userEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: userEntity,
        _class: 'HAS',
      }),
    );
    await jobState.addRelationships(accountUserRelationships);
  },
};

export default step;
