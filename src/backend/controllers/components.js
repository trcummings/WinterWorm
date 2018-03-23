import app from '../server';
import { makeController } from '../util';
import Components from '../services/components';

makeController(app, 'components', Components);
