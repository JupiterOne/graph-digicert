import {
  createMockStepExecutionContext,
  MockIntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { DigiCertIntegrationInstanceConfig } from '../src/types';

export function createStepContext(): MockIntegrationStepExecutionContext<
  DigiCertIntegrationInstanceConfig
> {
  return createMockStepExecutionContext<DigiCertIntegrationInstanceConfig>({
    instanceConfig: {
      apiKey: process.env.API_KEY || 'test',
    },
  });
}
