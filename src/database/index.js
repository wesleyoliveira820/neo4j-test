import neo4j from 'neo4j-driver';

export const driver = neo4j.driver('neo4j://localhost:7687', null);

const neoClient = driver.session({
  database: 'neo4j'
});

export { neoClient };
