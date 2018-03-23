import app from 'Backend/server';
import { makeController } from 'Backend/util';
import Components from 'Backend/services/components';

makeController(app, 'components', Components);
