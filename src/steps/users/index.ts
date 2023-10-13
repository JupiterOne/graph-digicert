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
import { createUserEntity } from '../../converter';
import { ACCOUNT_ENTITY_KEY } from '../account';

export async function fetchUsers({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  try {
    await client.iterateUsers(async (user) => {
      const userEntity = createUserEntity(user);

      if (userEntity) {
        await jobState.addEntity(userEntity);
      }

      if (userEntity && accountEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: accountEntity,
            to: userEntity,
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

export const usersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: StepIds.FETCH_USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [StepIds.FETCH_ACCOUNT],
    executionHandler: fetchUsers,
  },
];
