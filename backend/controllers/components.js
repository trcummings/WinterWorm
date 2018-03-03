const app = require('../server');
const { models } = require('../models');
const Components = require('../services/components');

// Components Controller
app.get('/components', (req, res) => {
  models.components.findAll().then(rows => res.send(JSON.stringify(rows)));
});

app.get('/components/:id', (req, res) => {
  const id = req.params.id;
  models.components.findById(id).then(rows => res.send(JSON.stringify(rows)));
});

app.post('/components', async (req, res) => {
  const { body: { batch } } = req;
  Components.create(batch[0]);
  // batch.forEach(Components.create);
  // models.components.bulkCreate(batch).then(rows => res.send(JSON.stringify(rows)));
});
