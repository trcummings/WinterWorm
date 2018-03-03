const app = require('../server');
const { models } = require('../models');
const EventTypes = require('../services/eventTypes');

// Components Controller
app.get('/event_types', (req, res) => {
  EventTypes.findAll().then(rows => res.send(JSON.stringify(rows)));
});

app.get('/event_types/:id', (req, res) => {
  const id = req.params.id;
  models.eventTypes.findById(id).then(rows => res.send(JSON.stringify(rows)));
});

app.post('/event_types', (req, res) => {
  const { body: { batch } } = req;
  models.eventTypes.bulkCreate(batch).then(rows => res.send(JSON.stringify(rows)));
});
