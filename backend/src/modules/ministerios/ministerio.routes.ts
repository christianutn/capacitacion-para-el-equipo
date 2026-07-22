import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/authenticate';
import { authorize } from '../../shared/middlewares/authorize';
import {
  getMinisterios,
  getMinisterioByCodController,
  postMinisterio,
  putMinisterio,
  deleteMinisterioController,
} from './ministerio.controller';

const ministerioRouter = Router();

ministerioRouter.get('/', authenticate, authorize(['ADM', 'REF', 'GA']), getMinisterios);
ministerioRouter.get('/:cod', authenticate, authorize(['ADM', 'REF', 'GA']), getMinisterioByCodController);
ministerioRouter.post('/', authenticate, authorize(['ADM']), postMinisterio);
ministerioRouter.put('/', authenticate, authorize(['ADM']), putMinisterio);
ministerioRouter.delete('/:cod', authenticate, authorize(['ADM']), deleteMinisterioController);

export default ministerioRouter;
