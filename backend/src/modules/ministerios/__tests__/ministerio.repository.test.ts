import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Ministerio, { MinisterioAttributes } from '../ministerio.model';
import * as repository from '../ministerio.repository';

// Mockear los modelos de Sequelize
jest.mock('../ministerio.model', () => {
  const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockModel,
  };
});

jest.mock('../../areas/area.model', () => {
  const mockModel = {
    findAll: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockModel,
  };
});

jest.mock('../../cursos/curso.model', () => {
  const mockModel = {
    findAll: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockModel,
  };
});

jest.mock('../../areas-asignadas-usuarios/area-asignada-usuario.model', () => {
  const mockModel = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockModel,
  };
});

jest.mock('../../../shared/db/sequelize', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));

describe('Ministerio Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllMinisterios', () => {
    it('debe llamar a Ministerio.findAll con include de áreas y retornar todos los ministerios', async () => {
      const mockMinisterios = [
        { cod: 'MIN_EDUC', nombre: 'Ministerio de Educación', esVigente: 1, detalle_areas: [] },
      ];
      (Ministerio.findAll as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue(mockMinisterios);

      const result = await repository.findAllMinisterios();

      expect(result).toEqual(mockMinisterios);
      expect(Ministerio.findAll).toHaveBeenCalledTimes(1);
      expect(Ministerio.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'detalle_areas' }),
          ]),
        }),
      );
    });
  });

  describe('findMinisterioByCod', () => {
    it('debe retornar el ministerio si existe', async () => {
      const mockMinisterio = { cod: 'MIN_EDUC', nombre: 'Ministerio de Educación', detalle_areas: [] };
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockMinisterio);

      const result = await repository.findMinisterioByCod('MIN_EDUC');

      expect(result).toEqual(mockMinisterio);
      expect(Ministerio.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { cod: 'MIN_EDUC' } }),
      );
    });

    it('debe lanzar NotFoundError si el ministerio no existe', async () => {
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<null>>).mockResolvedValue(null);

      await expect(repository.findMinisterioByCod('NOEXISTE')).rejects.toThrow('No existe el ministerio');
    });
  });

  describe('createMinisterio', () => {
    it('debe crear un ministerio cuando cod y nombre son únicos', async () => {
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<null>>).mockResolvedValue(null);
      const mockCreated = { cod: 'MIN_SAL', nombre: 'Ministerio de Salud', esVigente: 1 };
      (Ministerio.create as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockCreated);

      const result = await repository.createMinisterio({ cod: 'MIN_SAL', nombre: 'Ministerio de Salud' });

      expect(result).toEqual(mockCreated);
      expect(Ministerio.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar ConflictError si el código ya existe', async () => {
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue({ cod: 'MIN_SAL' });

      await expect(
        repository.createMinisterio({ cod: 'MIN_SAL', nombre: 'Otro Nombre' }),
      ).rejects.toThrow('El código ya existe');
    });
  });

  describe('deleteMinisterio', () => {
    it('debe eliminar el ministerio si existe', async () => {
      (Ministerio.destroy as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(1);

      const result = await repository.deleteMinisterio('MIN_SAL');

      expect(result).toBe(1);
      expect(Ministerio.destroy).toHaveBeenCalledWith({ where: { cod: 'MIN_SAL' } });
    });

    it('debe lanzar NotFoundError si no hay registros para eliminar', async () => {
      (Ministerio.destroy as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(0);

      await expect(repository.deleteMinisterio('NOEXISTE')).rejects.toThrow(
        'No se encontraron datos para eliminar',
      );
    });
  });
});
