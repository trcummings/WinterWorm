import app from 'Backend/server';
import { makeController } from 'Backend/util';
import Systems from 'Backend/services/systems';

makeController(app, 'systems', Systems);
