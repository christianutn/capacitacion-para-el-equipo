import { DataTypes, Model } from 'sequelize';
import sequelize from '../../shared/db/sequelize';

export interface MinisterioAttributes {
  cod: string;
  nombre: string;
  esVigente: 0 | 1 | null;
}

class Ministerio
  extends Model<MinisterioAttributes>
  implements MinisterioAttributes
{
  declare cod: string;
  declare nombre: string;
  declare esVigente: 0 | 1 | null;
}

Ministerio.init(
  {
    cod: {
      type: DataTypes.STRING(15),
      primaryKey: true,
    },
    nombre: DataTypes.STRING(100),
    esVigente: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'ministerios',
    timestamps: false,
  },
);

export default Ministerio;
