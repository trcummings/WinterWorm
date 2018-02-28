const app = require('./server');
const { db } = require('./models');

const PORT = 3001;

require('./controllers/components');
require('./controllers/systems');

app.listen(PORT, () => {
  console.log(`express server listening on ${PORT}`);
  console.log('initializing db...');

  db.sync({ force: true }).then(() => {
    console.log('db initialization complete!');
  });
});
