function createEntityKey(type: string, id: number | string): string {
  return `${type}:${id}`;
}

export default createEntityKey;
