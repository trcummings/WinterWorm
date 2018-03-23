import app from '../server';
import { makeController } from '../util';
import Entities from '../services/entities';

makeController(app, 'entities', Entities);
