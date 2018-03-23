import app from '../server';
import { makeController } from '../util';
import Scenes from '../services/scenes';

makeController(app, 'scenes', Scenes);
