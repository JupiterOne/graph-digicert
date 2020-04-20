import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertDomain } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-domains',
  name: 'Fetch Domains',
  types: ['digicert_domain'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);
    // TODO: Need to add pagination here, default returned/max is 1000
    const { domains } = await client.iterateDomains();

    await jobState.addEntities(domains.map(convertDomain));
  },
};

export default step;
