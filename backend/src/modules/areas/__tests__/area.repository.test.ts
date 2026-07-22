import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Area from '../area.model';
import Ministerio from '../../ministerios/ministerio.model';
import * as repository from '../area.repository';

// Mockear los modelos de Sequelize
jest.mock('../area.model', () => {
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

jest.mock('../../ministerios/ministerio.model', () => {
  const mockModel = {
    findOne: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockModel,
  };
});

describe('Area Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllAreas', () => {
    it('debe retornar todas las áreas con su ministerio incluido', async () => {
      const mockAreas = [
        { cod: 'AREA_01', nombre: 'Dir. Educación Superior', ministerio: 'MIN_EDUC', esVigente: 1, detalle_ministerio: { cod: 'MIN_EDUC', nombre: 'Min. Educación' } },
      ];
      (Area.findAll as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue(mockAreas);

      const result = await repository.findAllAreas();

      expect(result).toEqual(mockAreas);
      expect(Area.findAll).toHaveBeenCalledTimes(1);
      expect(Area.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'detalle_ministerio' }),
          ]),
        }),
      );
    });

    it('debe filtrar por nombre cuando se provee búsqueda', async () => {
      (Area.findAll as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue([]);

      await repository.findAllAreas('educación');

      expect(Area.findAll).toHaveBeenCalledTimes(1);
      // Verificar que se llamó con un filtro where
      const callArgs = (Area.findAll as jest.Mock).mock.calls[0] as any[];
      expect(callArgs[0].where).toBeDefined();
    });
  });

  describe('createArea', () => {
    it('debe crear un área cuando el cod es único y el ministerio existe', async () => {
      (Area.findOne as jest.Mock<(...args: any[]) => Promise<null>>).mockResolvedValue(null);
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue({ cod: 'MIN_EDUC' });
      const mockCreated = { cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'MIN_EDUC', esVigente: 1 };
      (Area.create as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockCreated);

      const result = await repository.createArea({ cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'MIN_EDUC' });

      expect(result).toEqual(mockCreated);
      expect(Area.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar ConflictError si el código ya existe', async () => {
      (Area.findOne as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue({ cod: 'AREA_02' });

      await expect(
        repository.createArea({ cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'MIN_EDUC' }),
      ).rejects.toThrow('El código de área ya existe');
    });

    it('debe lanzar NotFoundError si el ministerio no existe', async () => {
      (Area.findOne as jest.Mock<(...args: any[]) => Promise<null>>).mockResolvedValue(null);
      (Ministerio.findOne as jest.Mock<(...args: any[]) => Promise<null>>).mockResolvedValue(null);

      await expect(
        repository.createArea({ cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'NOEXISTE' }),
      ).rejects.toThrow('No se encontró un ministerio con el código NOEXISTE');
    });
  });

  describe('deleteArea', () => {
    it('debe eliminar el área si existe', async () => {
      (Area.destroy as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(1);

      const result = await repository.deleteArea('AREA_01');

      expect(result).toBe(1);
      expect(Area.destroy).toHaveBeenCalledWith({ where: { cod: 'AREA_01' } });
    });

    it('debe lanzar NotFoundError si no existe', async () => {
      (Area.destroy as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(0);

      await expect(repository.deleteArea('NOEXISTE')).rejects.toThrow('Área no encontrada');
    });
  });
});
