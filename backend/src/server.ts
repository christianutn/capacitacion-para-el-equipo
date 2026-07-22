import app from './app';
import config from './shared/config/env.config';
import sequelize from './shared/db/sequelize';
// import { registerAssociations } from './shared/db/associations';

const startServer = async () => {
  try {
    // 1. Verificar conexión con la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // 2. Registrar relaciones entre modelos de Sequelize
    //registerAssociations();

    // 3. Arrancar el servidor HTTP
    app.listen(config.port, () => {
      console.log(
        `🚀 Servidor corriendo en modo [${config.env}] en el puerto ${config.port}`,
      );
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
