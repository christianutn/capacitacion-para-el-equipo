import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/authenticate';
import { authorize } from '../../shared/middlewares/authorize';
import {
  getAreas,
  postArea,
  putArea,
  deleteAreaController,
} from './area.controller';

const areaRouter = Router();

areaRouter.get('/', authenticate, authorize(['ADM', 'GA']), getAreas);
areaRouter.post('/', authenticate, authorize(['ADM']), postArea);
areaRouter.put('/', authenticate, authorize(['ADM', 'GA']), putArea);
areaRouter.delete('/:cod', authenticate, authorize(['ADM']), deleteAreaController);

export default areaRouter;
