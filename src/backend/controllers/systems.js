const app = require('../server');
const { makeController } = require('../util');
const Systems = require('../services/systems');

makeController(app, 'systems', Systems);
