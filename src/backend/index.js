import 'babel-polyfill';

import app from './server';
import { db } from './models';

import './controllers/init';
import './controllers/components';
import './controllers/systems';
import './controllers/eventTypes';
import './controllers/entities';
import './controllers/componentStates';

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
