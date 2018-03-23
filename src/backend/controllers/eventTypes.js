import app from 'Backend/server';
import { makeController } from 'Backend/util';
import EventTypes from 'Backend/services/eventTypes';

makeController(app, 'event_types', EventTypes);
