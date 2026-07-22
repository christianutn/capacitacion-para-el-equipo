import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../../../shared/middlewares/errorHandler';
import ministerioRouter from '../ministerio.routes';
import * as repository from '../ministerio.repository';

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
jest.mock('../ministerio.repository');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/ministerios', ministerioRouter);
app.use(errorHandler);

describe('Ministerios Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /ministerios', () => {
    it('debe retornar 200 y la lista de ministerios', async () => {
      const mockMinisterios = [
        { cod: 'MIN_EDUC', nombre: 'Ministerio de Educación', esVigente: 1, detalle_areas: [] },
      ];
      (repository.findAllMinisterios as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue(mockMinisterios);

      const response = await request(app).get('/ministerios');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMinisterios);
      expect(repository.findAllMinisterios).toHaveBeenCalledTimes(1);
    });

    it('debe retornar 404 si no existen ministerios', async () => {
      (repository.findAllMinisterios as jest.Mock<(...args: any[]) => Promise<any[]>>).mockResolvedValue([]);

      const response = await request(app).get('/ministerios');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No existen ministerios');
    });
  });

  describe('GET /ministerios/:cod', () => {
    it('debe retornar 200 y el ministerio encontrado', async () => {
      const mockMinisterio = { cod: 'MIN_EDUC', nombre: 'Ministerio de Educación', detalle_areas: [] };
      (repository.findMinisterioByCod as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockMinisterio);

      const response = await request(app).get('/ministerios/MIN_EDUC');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMinisterio);
    });
  });

  describe('POST /ministerios', () => {
    it('debe retornar 201 al crear un ministerio', async () => {
      const mockCreated = { cod: 'MIN_SAL', nombre: 'Ministerio de Salud', esVigente: 1 };
      (repository.createMinisterio as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockCreated);

      const response = await request(app)
        .post('/ministerios')
        .send({ cod: 'MIN_SAL', nombre: 'Ministerio de Salud' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreated);
    });
  });

  describe('PUT /ministerios', () => {
    it('debe retornar 200 al actualizar un ministerio', async () => {
      const mockResult = { cod: 'MIN_EDUC', nombre: 'Ministerio de Educación Actualizado' };
      (repository.updateMinisterio as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue(mockResult);

      const response = await request(app)
        .put('/ministerios')
        .send({ cod: 'MIN_EDUC', nombre: 'Ministerio de Educación Actualizado' });

      expect(response.status).toBe(200);
      expect(response.body.ministerio).toEqual(mockResult);
    });
  });

  describe('DELETE /ministerios/:cod', () => {
    it('debe retornar 200 al eliminar un ministerio', async () => {
      (repository.deleteMinisterio as jest.Mock<(...args: any[]) => Promise<number>>).mockResolvedValue(1);

      const response = await request(app).delete('/ministerios/MIN_SAL');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Ministerio eliminado');
    });
  });
});
