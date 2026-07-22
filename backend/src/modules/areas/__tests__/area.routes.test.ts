import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../../../shared/middlewares/errorHandler';
import areaRouter from '../area.routes';
import * as repository from '../area.repository';

// Mockear los middlewares de autenticación y autorización
jest.mock('../../../shared/middlewares/authenticate', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { user: { cuil: '20123456789', rol: 'ADM', token_version: 1 } };
    next();
  },
}));

jest.mock('../../../shared/middlewares/authorize', () => ({
  authorize: () => (req: any, _res: any, next: any) => next(),
}));

// Mockear el repository
jest.mock('../area.repository');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/areas', areaRouter);
app.use(errorHandler);

describe('Áreas Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /areas', () => {
    it('debe retornar 200 y la lista de áreas', async () => {
      const mockAreas = [
        { cod: 'AREA_01', nombre: 'Dir. Educación Superior', ministerio: 'MIN_EDUC', esVigente: 1 },
      ];
      (repository.findAllAreas as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue(mockAreas);

      const response = await request(app).get('/areas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAreas);
      expect(repository.findAllAreas).toHaveBeenCalledTimes(1);
    });

    it('debe retornar 404 si no existen áreas', async () => {
      (repository.findAllAreas as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue([]);

      const response = await request(app).get('/areas');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No existen áreas');
    });

    it('debe pasar el parámetro busqueda al repository', async () => {
      const mockAreas = [
        { cod: 'AREA_01', nombre: 'Dir. Educación', ministerio: 'MIN_EDUC', esVigente: 1 },
      ];
      (repository.findAllAreas as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue(mockAreas);

      const response = await request(app).get('/areas?busqueda=educación');

      expect(response.status).toBe(200);
      expect(repository.findAllAreas).toHaveBeenCalledWith('educación');
    });
  });

  describe('POST /areas', () => {
    it('debe retornar 201 al crear un área', async () => {
      const mockCreated = { cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'MIN_SAL', esVigente: 1 };
      (repository.createArea as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockCreated);

      const response = await request(app)
        .post('/areas')
        .send({ cod: 'AREA_02', nombre: 'Dir. Salud', ministerio: 'MIN_SAL' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreated);
    });
  });

  describe('PUT /areas', () => {
    it('debe retornar 200 al actualizar un área', async () => {
      const mockResult = { cod: 'AREA_01', nombre: 'Dir. Educación Actualizada', ministerio: 'MIN_EDUC' };
      (repository.updateArea as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockResult);

      const response = await request(app)
        .put('/areas')
        .send({ cod: 'AREA_01', nombre: 'Dir. Educación Actualizada', ministerio: 'MIN_EDUC' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });
  });

  describe('DELETE /areas/:cod', () => {
    it('debe retornar 200 al eliminar un área', async () => {
      (repository.deleteArea as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(1);

      const response = await request(app).delete('/areas/AREA_01');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Área eliminada correctamente');
    });
  });
});
