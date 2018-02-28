const app = require('../server');
const { db } = require('../models');

// Systems Controller
app.get('/systems', (req, res) => {
  db.query('SELECT * FROM systems')
    .then(rows => res.send(JSON.stringify(rows)));
});

app.get('/systems/:id', (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM systems WHERE id = ${id}`)
    .then(rows => res.send(JSON.stringify(rows)));
});
