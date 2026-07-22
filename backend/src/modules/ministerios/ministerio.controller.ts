import { Request, Response } from 'express';
import {
  findAllMinisterios,
  findMinisterioByCod,
  createMinisterio,
  updateMinisterio,
  deleteMinisterio,
} from './ministerio.repository';
import { NotFoundError } from '../../shared/errors/AppError';
import {
  createMinisterioSchema,
  updateMinisterioSchema,
  deleteMinisterioSchema,
  getMinisterioByCodSchema,
} from './ministerio.schemas';

export const getMinisterios = async (req: Request, res: Response): Promise<void> => {
  const userPayload = req.user?.user;
  const cuil = userPayload?.cuil;
  const rol = userPayload?.rol;
  const area = userPayload?.area;

  const ministerios = await findAllMinisterios(cuil, rol, area);
  if (ministerios.length === 0) throw new NotFoundError('No existen ministerios');
  res.status(200).json(ministerios);
};

export const getMinisterioByCodController = async (req: Request, res: Response): Promise<void> => {
  const { params } = getMinisterioByCodSchema.parse({ params: req.params });
  const ministerio = await findMinisterioByCod(params.cod);
  res.status(200).json(ministerio);
};

export const postMinisterio = async (req: Request, res: Response): Promise<void> => {
  const { body } = createMinisterioSchema.parse({ body: req.body });
  const ministerio = await createMinisterio(body);
  res.status(201).json(ministerio);
};

export const putMinisterio = async (req: Request, res: Response): Promise<void> => {
  const { body } = updateMinisterioSchema.parse({ body: req.body });
  const result = await updateMinisterio(body);
  res.status(200).json({ message: 'Ministerio actualizado correctamente', ministerio: result });
};

export const deleteMinisterioController = async (req: Request, res: Response): Promise<void> => {
  const { params } = deleteMinisterioSchema.parse({ params: req.params });
  const deleted = await deleteMinisterio(params.cod);
  res.status(200).json({ message: 'Ministerio eliminado', deleted });
};
