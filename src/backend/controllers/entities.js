import app from 'Backend/server';
import { makeController } from 'Backend/util';
import Entities from 'Backend/services/entities';

makeController(app, 'entities', Entities);
