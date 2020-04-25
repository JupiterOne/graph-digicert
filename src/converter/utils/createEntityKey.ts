function createApiKeyEntityIdentifier(type: string, id: number): string {
  return `${type}:${id}`;
}

export default createApiKeyEntityIdentifier;
