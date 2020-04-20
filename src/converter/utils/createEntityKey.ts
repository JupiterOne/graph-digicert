/**
 * DO NOT change this constant. IDs are not long enough
 * to generate keys that match the min length
 * the data model requires
 */
const API_KEY_ID_PREFIX = 'digicert-';
function createApiKeyEntityIdentifier(type: string, id: number): string {
  return `${API_KEY_ID_PREFIX}${type}:${id}`;
}

export default createApiKeyEntityIdentifier;
