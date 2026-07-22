import { Sequelize } from 'sequelize';
import config from '../config/env.config';

const { name, user, password, host, port } = config.database;

/**
 * Instancia única de Sequelize (Singleton).
 * Se importa desde cualquier model o repository con:
 *   import sequelize from '@shared/db/sequelize';
 */
const sequelize = new Sequelize(name!, user!, password, {
  host,
  dialect: 'mysql',
  port: port as number,
  timezone: '-03:00', // Zona horaria de Argentina (ART)
  logging: config.isDevelopment ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // Evita que mysql2 convierta DATE/DATETIME a objetos Date de JS,
    // previniendo problemas de timezone donde '2026-03-15' se convierte
    // a '2026-03-14T21:00:00.000Z' por la diferencia horaria (UTC-3).
    dateStrings: true,
    typeCast(field: { type: string; string: () => string }, next: () => unknown) {
      if (
        field.type === 'DATETIME' ||
        field.type === 'DATE' ||
        field.type === 'TIMESTAMP'
      ) {
        return field.string();
      }
      return next();
    },
  },
  define: {
    freezeTableName: true, // Desactiva la pluralización automática del nombre de tabla
  },
});

export default sequelize;
