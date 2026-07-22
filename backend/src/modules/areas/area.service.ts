import * as areaRepository from './area.repository';
import Area from './area.model';

/**
 * Obtiene un área por su código.
 * Retorna null si no existe (no lanza error, para que el llamador decida).
 */
export const getAreaByCod = async (cod: string): Promise<Area | null> => {
  return areaRepository.findAreaByCod(cod);
};
