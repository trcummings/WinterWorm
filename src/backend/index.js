import 'babel-polyfill';

import app from './server';
import { db } from './models';

process.on('SIGINT', () => {
  console.log('Exiting backend/index.js via SIGINT event...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Exiting backend/index.js via SIGTERM event...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.log('Exiting backend/index.js via "uncaughtException" event...');
  console.error(err);
  process.send({ type: 'ERROR', payload: err });
  process.exit(0);
});

const PORT = 3001;

require('./controllers/init');
require('./controllers/components');
require('./controllers/systems');
require('./controllers/eventTypes');
require('./controllers/entities');
require('./controllers/componentStates');


app.listen(PORT, (err) => {
  if (err) process.send({ type: 'ERROR', payload: err });

  console.log(`express server listening on ${PORT}`);
  console.log('initializing db...');

  const force = JSON.parse(process.env.INIT_DB);

  db.sync({ force }).then(() => {
    console.log('db initialization complete!');
    process.send({ type: 'SYNC', payload: true });
  });
});
