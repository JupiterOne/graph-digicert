import {
  IntegrationStep,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { Entities, Relationships, StepIds } from '../../constants';
import { convertAccount, convertOrder, convertUser } from '../../converter';
import { DigiCertIntegrationInstanceConfig } from '../../types';

const step: IntegrationStep<DigiCertIntegrationInstanceConfig> = {
  id: StepIds.SYNCHRONIZE,
  name: 'Fetch DigiCert Objects',
  entities: [Entities.ACCOUNT, Entities.USER, Entities.CERTIFICATE],
  relationships: [
    Relationships.ACCOUNT_HAS_USER,
    Relationships.ACCOUNT_HAS_CERTIFICATE,
  ],
  async executionHandler({ instance, jobState }) {
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
      createDirectRelationship({
        from: accountEntity,
        to: orderEntity,
        _class: RelationshipClass.HAS,
      }),
    );
    await jobState.addRelationships(accountOrderRelationships);

    const accountUserRelationships = userEntities.map((userEntity) =>
      createDirectRelationship({
        from: accountEntity,
        to: userEntity,
        _class: RelationshipClass.HAS,
      }),
    );
    await jobState.addRelationships(accountUserRelationships);
  },
};

export default step;
