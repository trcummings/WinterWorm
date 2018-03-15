const app = require('../server');
const { makeController } = require('../util');
const Scenes = require('../services/scenes');

makeController(app, 'scenes', Scenes);
