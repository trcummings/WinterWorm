import fs from 'fs';

import * as symbols from 'Symbols';
import agent from './dbAgent';

const getAllJson = basePath => (
  fs.readdirSync(basePath)
    .map(fPath => JSON.parse(fs.readFileSync(`${basePath}/${fPath}`, 'utf8')))
);

const initDb = () => new Promise((resolve) => {
  const eventTypes = Object.keys(symbols.events).map(label => ({ label }));
  const components = getAllJson(process.env.COMPONENT_SPEC_PATH);
  const systems = getAllJson(process.env.SYSTEM_SPEC_PATH);

  return agent.post({
    uri: 'init',
    form: { eventTypes, components, systems },
  }).then(resolve);
});

export default initDb;
