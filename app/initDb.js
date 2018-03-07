import fs from 'fs';

import * as symbols from 'Symbols';

const getAllJson = basePath => (
  fs.readdirSync(basePath)
    .map(fPath => JSON.parse(fs.readFileSync(`${basePath}/${fPath}`, 'utf8')))
);

const initDb = (agent, cb) => {
  const eventTypes = Object.keys(symbols.events).map(label => ({ label }));
  const components = getAllJson(process.env.COMPONENT_SPEC_PATH);
  const systems = getAllJson(process.env.SYSTEM_SPEC_PATH);

  agent.post({
    uri: 'init',
    form: { eventTypes, components, systems },
  }).then(cb);
};

export default initDb;
