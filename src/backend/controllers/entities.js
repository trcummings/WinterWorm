const app = require('../server');
const { makeController } = require('../util');
const Entities = require('../services/entities');

makeController(app, 'entities', Entities);
