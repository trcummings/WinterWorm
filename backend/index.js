const app = require('./server');
const { db } = require('./models');

const PORT = 3001;

require('./controllers/init');
require('./controllers/components');
require('./controllers/systems');
require('./controllers/eventTypes');
require('./controllers/entities');

app.listen(PORT, () => {
  console.log(`express server listening on ${PORT}`);
  console.log('initializing db...');

  const force = JSON.parse(process.env.INIT_DB);

  db.sync({ force }).then(() => {
    console.log('db initialization complete!');
    process.send('SYNC_COMPLETE');
  });
});
