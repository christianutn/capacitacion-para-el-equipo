import { Op } from 'sequelize';
import sequelize from '../../shared/db/sequelize';
import Ministerio from './ministerio.model';
import Area from '../areas/area.model';
import Curso from '../cursos/curso.model';
import AreaAsignadaUsuario from '../areas-asignadas-usuarios/area-asignada-usuario.model';
import { NotFoundError, BadRequestError, ConflictError } from '../../shared/errors/AppError';
import { CreateMinisterioDto, UpdateMinisterioDto } from './ministerio.schemas';

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

export const findAllMinisterios = async (cuil?: string, rol?: string, userArea?: string) => {
  const effectiveRol = rol || 'ADM';

  if (effectiveRol === 'ADM' || effectiveRol === 'GA') {
    return Ministerio.findAll({
      include: [
        {
          model: Area,
          as: 'detalle_areas',
          include: [
            {
              model: Curso,
              as: 'detalle_cursos',
            },
          ],
        },
      ],
    });
  }

  if (!cuil || !userArea) {
    throw new BadRequestError('No se encontraron los datos del usuario (cuil o area)');
  }

  // Obtener áreas asignadas al usuario
  const areasAsignadas = await AreaAsignadaUsuario.findAll({
    where: { usuario: cuil },
  });

  const codigosArea = [userArea];
  if (areasAsignadas.length > 0) {
    areasAsignadas.forEach((aa) => {
      codigosArea.push(aa.area);
    });
  }

  return Ministerio.findAll({
    include: [
      {
        model: Area,
        as: 'detalle_areas',
        where: {
          cod: {
            [Op.in]: codigosArea,
          },
        },
        include: [
          {
            model: Curso,
            as: 'detalle_cursos',
          },
        ],
      },
    ],
  });
};

export const findMinisterioByCod = async (cod: string) => {
  const ministerio = await Ministerio.findOne({
    where: { cod },
    include: [
      {
        model: Area,
        as: 'detalle_areas',
      },
    ],
  });

  if (!ministerio) throw new NotFoundError('No existe el ministerio');
  return ministerio;
};

export const createMinisterio = async (data: CreateMinisterioDto) => {
  const existeCod = await Ministerio.findOne({ where: { cod: data.cod } });
  if (existeCod) throw new ConflictError('El código ya existe');

  const existeNombre = await Ministerio.findOne({ where: { nombre: data.nombre } });
  if (existeNombre) throw new ConflictError('El nombre ya existe');

  return Ministerio.create({ cod: data.cod, nombre: data.nombre, esVigente: 1 });
};

export const updateMinisterio = async (data: UpdateMinisterioDto) => {
  const { cod, nombre, esVigente } = data;
  const t = await sequelize.transaction();

  try {
    const ministerio = await Ministerio.findOne({ where: { cod }, transaction: t });
    if (!ministerio) throw new NotFoundError(`No se encontró un ministerio con el código ${cod}`);

    const [affectedRows] = await Ministerio.update(
      {
        nombre,
        ...(esVigente !== undefined && { esVigente: parseEsVigente(esVigente) }),
      },
      { where: { cod }, transaction: t },
    );

    if (affectedRows === 0) throw new BadRequestError('No existen datos para actualizar');

    await t.commit();
    return { cod, nombre };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteMinisterio = async (cod: string) => {
  const deleted = await Ministerio.destroy({ where: { cod } });
  if (deleted === 0) throw new NotFoundError(`No se encontraron datos para eliminar con el código ${cod}`);
  return deleted;
};
