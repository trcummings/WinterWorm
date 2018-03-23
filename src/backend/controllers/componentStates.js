import app from 'Backend/server';
import { makeController } from 'Backend/util';
import ComponentStates from 'Backend/services/componentStates';

makeController(app, 'componentStates', ComponentStates);
