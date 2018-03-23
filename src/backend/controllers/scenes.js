import app from 'Backend/server';
import { makeController } from 'Backend/util';
import Scenes from 'Backend/services/scenes';

makeController(app, 'scenes', Scenes);
