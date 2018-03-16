const app = require('../server');
const { makeController } = require('../util');
const ComponentStates = require('../services/componentStates');

makeController(app, 'componentStates', ComponentStates);
