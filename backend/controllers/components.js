const app = require('../server');
const { models } = require('../models');

// Components Controller
app.get('/components', (req, res) => {
  models.Components.findAll().then(rows => res.send(JSON.stringify(rows)));
});

app.get('/components/:id', (req, res) => {
  const id = req.params.id;
  models.Components.findById(id).then(rows => res.send(JSON.stringify(rows)));
});

app.post('/components', (req, res) => {
  console.log(req.body, 'creating component!');
});
