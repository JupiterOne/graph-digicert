import {
  IntegrationExecutionContext,
  IntegrationInstance,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from './collector';
import { DigiCertIntegrationInstanceConfig } from './types';

export default async function validateInvocation(
  context: IntegrationExecutionContext<DigiCertIntegrationInstanceConfig>,
): Promise<void> {
  context.logger.info(
    {
      instance: context.instance,
    },
    'Validating integration config...',
  );

  if (await isConfigurationValid(context.instance)) {
    context.logger.info('Integration instance is valid!');
  } else {
    throw new Error('Failed to authenticate with provided credentials');
  }
}

async function isConfigurationValid(
  instance: IntegrationInstance<DigiCertIntegrationInstanceConfig>,
): Promise<boolean> {
  // perform test api call. This will fail if we do not have access.
  try {
    const client = createServicesClient(instance);
    await client.iterateDomains();
    return true;
  } catch (err) {
    return false;
  }
}
