import app from '../server';
import { makeController } from '../util';
import Systems from '../services/systems';

makeController(app, 'systems', Systems);
