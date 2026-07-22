import { Request, Response } from 'express';
import {
  findAllAreas,
  createArea,
  updateArea,
  deleteArea,
} from './area.repository';
import { NotFoundError } from '../../shared/errors/AppError';
import {
  getAreasQuerySchema,
  createAreaSchema,
  updateAreaSchema,
  deleteAreaSchema,
} from './area.schemas';

export const getAreas = async (req: Request, res: Response): Promise<void> => {
  const { query } = getAreasQuerySchema.parse({ query: req.query });
  const areas = await findAllAreas(query.busqueda);
  if (areas.length === 0) throw new NotFoundError('No existen áreas');
  res.status(200).json(areas);
};

export const postArea = async (req: Request, res: Response): Promise<void> => {
  const { body } = createAreaSchema.parse({ body: req.body });
  const area = await createArea(body);
  res.status(201).json(area);
};

export const putArea = async (req: Request, res: Response): Promise<void> => {
  const { body } = updateAreaSchema.parse({ body: req.body });
  const result = await updateArea(body);
  res.status(200).json(result);
};

export const deleteAreaController = async (req: Request, res: Response): Promise<void> => {
  const { params } = deleteAreaSchema.parse({ params: req.params });
  const deleted = await deleteArea(params.cod);
  res.status(200).json({ message: 'Área eliminada correctamente', deleted });
};
