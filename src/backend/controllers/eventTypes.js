const app = require('../server');
const { makeController } = require('../util');
const EventTypes = require('../services/eventTypes');

makeController(app, 'event_types', EventTypes);
