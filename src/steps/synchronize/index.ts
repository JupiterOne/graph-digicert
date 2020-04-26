import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertAccount, convertOrder } from '../../converter';

const step: IntegrationStep = {
  id: 'synchronize',
  name: 'Fetch DigiCert Objects',
  types: ['digicert_domain', 'digicert_certificate'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);

    const account = await client.getAccountDetails();
    const accountEntity = convertAccount(account);
    await jobState.addEntities([accountEntity]);

    // TODO: Need to add pagination here, default returned/max is 1000
    const { orders } = await client.iterateOrders();
    const orderEntities = orders ? orders.map(convertOrder) : [];
    await jobState.addEntities(orderEntities);

    const accountOrderRelationships = orderEntities.map((orderEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: orderEntity,
        _class: 'HAS',
      }),
    );
    await jobState.addRelationships(accountOrderRelationships);
  },
};

export default step;
