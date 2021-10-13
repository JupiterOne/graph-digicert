import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { DigiCertIntegrationInstanceConfig } from './types';

const instanceConfigFields: IntegrationInstanceConfigFieldMap<DigiCertIntegrationInstanceConfig> = {
  apiKey: {
    type: 'string',
    mask: true,
  },
};

export default instanceConfigFields;
