const app = require('../server');
const { makeController } = require('../util');
const Components = require('../services/components');

makeController(app, 'components', Components);
