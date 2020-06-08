import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import synchronize from './steps/synchronize';
import { DigiCertIntegrationInstanceConfig } from './types';

export const invocationConfig: IntegrationInvocationConfig<DigiCertIntegrationInstanceConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [synchronize],
};
