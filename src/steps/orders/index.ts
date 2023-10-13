import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Relationships, StepIds } from '../constants';
import { createAPIClient } from '../../client';
import { createOrderEntity } from '../../converter';
import { ACCOUNT_ENTITY_KEY } from '../account';

export async function fetchOrders({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  try {
    await client.iterateOrders(async (order) => {
      const orderEntity = createOrderEntity(order);

      if (orderEntity) {
        await jobState.addEntity(orderEntity);
      }

      if (orderEntity && accountEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: accountEntity,
            to: orderEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    });
  } catch (err) {
    if (err.status === 403) {
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Received authorization error when attempting to call ${err.endpoint}: ${err.statusText}. Please make sure your API key has enough privilegdes to perform this action.`,
      });
      return;
    }

    throw err;
  }
}

export const ordersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: StepIds.FETCH_ORDERS,
    name: 'Fetch Orders',
    entities: [Entities.CERTIFICATE],
    relationships: [Relationships.ACCOUNT_HAS_CERTIFICATE],
    dependsOn: [StepIds.FETCH_ACCOUNT],
    executionHandler: fetchOrders,
  },
];
