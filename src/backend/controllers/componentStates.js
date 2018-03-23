import app from '../server';
import { makeController } from '../util';
import ComponentStates from '../services/componentStates';

makeController(app, 'componentStates', ComponentStates);
