import app from '../server';
import { makeController } from '../util';
import EventTypes from '../services/eventTypes';

makeController(app, 'event_types', EventTypes);
