import fs from 'fs';

import * as symbols from 'Symbols';
import agent from './dbAgent';

// const getJson = (total = {}, basePath) => {
//   const stats = fs.lstatSync(basePath);
//   if (!stats.isDirectory()) return total;
//   const assetFiles = fs.readdirSync(basePath);
//   const jsonPath = assetFiles.find(fPath => fPath.includes('.json'));
//
//   if (!jsonPath) {
//     console.warning(`no json found in ${basePath}`);
//     return total;
//   }
//   const fullAtlasPath = `${basePath}/${jsonPath}`;
//   const [resourceName] = jsonPath.split('.json');
//   const json = JSON.parse(fs.readFileSync(fullAtlasPath, 'utf8'));
//
//   return {
//     ...total,
//     [resourceName]: {
//       json,
//       resourceName,
//       fullPath: fullAtlasPath,
//     },
//   };
// };

const getAllJson = basePath => (
  fs.readdirSync(basePath)
    .map(fPath => JSON.parse(fs.readFileSync(`${basePath}/${fPath}`, 'utf8')))
);

// const sendBatch = (uri, batch) => agent.post({ uri, form: { batch }, query: { batch: true } });

const initDb = (cb) => {
  const eventTypes = Object.keys(symbols.events).map(label => ({ label }));
  const components = getAllJson(process.env.COMPONENT_SPEC_PATH);

  agent.post({ uri: 'init', form: { eventTypes, components } }).then(cb);
};

export default initDb;
//
// export const addComponents = (cb) => {
//   const batch = getAllJson(process.env.COMPONENT_SPEC_PATH);
//   sendBatch('components', batch)
//     .then((resp) => {
//       console.log(JSON.parse(resp, null, 2));
//       cb();
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
//
// export const addAllEvents = (cb) => {
//   const batch = Object.keys(symbols.events).map(label => ({ label }));
//   sendBatch('event_types', batch)
//     .then((resp) => {
//       console.log(JSON.parse(resp, null, 2));
//       cb();
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
