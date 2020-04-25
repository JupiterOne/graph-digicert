import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertDomainCertificate, convertAccount } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-domains',
  name: 'Fetch Domains',
  types: ['digicert_domain'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);

    const account = await client.getAccountDetails();
    const accountEntity = convertAccount(account);
    await jobState.addEntities([accountEntity]);

    // TODO: Need to add pagination here, default returned/max is 1000
    const { domains } = await client.iterateDomains();
    const domainEntities = domains.map(convertDomainCertificate);
    await jobState.addEntities(domainEntities);

    const accountDomainRelationships = domainEntities.map((domainEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: domainEntity,
        _class: 'HAS',
      }),
    );
    await jobState.addRelationships(accountDomainRelationships);
  },
};

export default step;
