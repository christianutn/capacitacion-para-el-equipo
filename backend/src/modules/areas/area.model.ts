import { DataTypes, Model } from 'sequelize';
import sequelize from '../../shared/db/sequelize';

export interface AreaAttributes {
  cod: string;
  nombre: string;
  ministerio: string;
  esVigente: 0 | 1 | null;
}

class Area
  extends Model<AreaAttributes>
  implements AreaAttributes
{
  declare cod: string;
  declare nombre: string;
  declare ministerio: string;
  declare esVigente: 0 | 1 | null;
}

Area.init(
  {
    cod: {
      type: DataTypes.STRING(15),
      primaryKey: true,
    },
    nombre: DataTypes.STRING(250),
    ministerio: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    esVigente: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'areas',
    timestamps: false,
  },
);

export default Area;
