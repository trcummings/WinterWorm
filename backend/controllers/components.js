const app = require('../server');
const { db, models } = require('../models');

// Components Controller
app.get('/components', (req, res) => {
  db.query('SELECT * FROM components')
    .then(rows => res.send(JSON.stringify(rows)));
});

app.get('/components/:id', (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM systems WHERE id = ${id}`)
    .then(rows => res.send(JSON.stringify(rows)));
});

app.post('/components', (req, res) => {
  console.log(req.body, 'creating component!');
});
