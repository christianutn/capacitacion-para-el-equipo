import { Op } from 'sequelize';
import Area from './area.model';
import Ministerio from '../ministerios/ministerio.model';
import { NotFoundError, ConflictError, BadRequestError } from '../../shared/errors/AppError';
import { CreateAreaDto, UpdateAreaDto } from './area.schemas';

// ---------------------------------------------------------------------------
// Utilidad interna
// ---------------------------------------------------------------------------
const parseEsVigente = (value: unknown): 0 | 1 => {
  if (value === true || value === 'Si' || value === 'si' || value === 1 || value === '1') return 1;
  if (value === false || value === 'No' || value === 'no' || value === 0 || value === '0') return 0;
  throw new BadRequestError("Valor de 'esVigente' inválido");
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const findAllAreas = async (busqueda?: string) => {
  const filtro: Record<string, unknown> = {};

  if (busqueda) {
    filtro[Op.or as unknown as string] = [
      { nombre: { [Op.like]: `%${busqueda}%` } },
    ];
  }

  return Area.findAll({
    include: [
      {
        model: Ministerio,
        as: 'detalle_ministerio',
        attributes: ['cod', 'nombre'],
      },
    ],
    where: filtro,
  });
};

export const createArea = async (data: CreateAreaDto) => {
  const existeCod = await Area.findOne({ where: { cod: data.cod } });
  if (existeCod) throw new ConflictError('El código de área ya existe');

  // Verificar que el ministerio referenciado exista
  const ministerio = await Ministerio.findOne({ where: { cod: data.ministerio } });
  if (!ministerio) throw new NotFoundError(`No se encontró un ministerio con el código ${data.ministerio}`);

  return Area.create({ cod: data.cod, nombre: data.nombre, ministerio: data.ministerio, esVigente: 1 });
};

export const updateArea = async (data: UpdateAreaDto) => {
  const { cod, nombre, ministerio, esVigente } = data;

  const area = await Area.findOne({ where: { cod } });
  if (!area) throw new NotFoundError('Área no encontrada');

  // Verificar que el ministerio referenciado exista
  const existeMinisterio = await Ministerio.findOne({ where: { cod: ministerio } });

  if (!existeMinisterio) throw new NotFoundError(`No se encontró un ministerio con el código ${ministerio}`);


  const [affectedRows] = await Area.update(
    {
      cod,
      nombre,
      ministerio,
      ...(esVigente !== undefined && { esVigente: parseEsVigente(esVigente) }),
    },
    { where: { cod } },
  );

  if (affectedRows === 0) throw new BadRequestError('No se pudo actualizar el área');

  return { cod, nombre, ministerio };
};

export const deleteArea = async (cod: string) => {
  const deleted = await Area.destroy({ where: { cod } });
  if (deleted === 0) throw new NotFoundError('Área no encontrada');
  return deleted;
};

export const findAreaByCod = async (cod: string): Promise<Area | null> => {
  return Area.findByPk(cod);
};
