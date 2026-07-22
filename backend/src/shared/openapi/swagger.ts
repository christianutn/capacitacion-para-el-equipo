// import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
// import { registry } from './registry';

// // Es importante asegurar que todos los archivos que registran rutas sean importados antes
// // de llamar a esta función.
// import '../../modules/auth/auth.docs';
// import '../../modules/plataformas-dictado/plataforma-dictado.docs';
// import '../../modules/medios-inscripcion/medio-inscripcion.docs';
// import '../../modules/roles/rol.docs';
// import '../../modules/departamentos/departamento.docs';
// import '../../modules/estados-instancias/estado-instancia.docs';
// import '../../modules/tipos-certificacion/tipo-certificacion.docs';
// import '../../modules/perfiles/perfil.docs';
// import '../../modules/areas-tematicas/area-tematica.docs';
// import '../../modules/roles-tutor/rol-tutor.docs';
// import '../../modules/tipos-capacitacion/tipo-capacitacion.docs';
// import '../../modules/ministerios/ministerio.docs';
// import '../../modules/areas/area.docs';
// import '../../modules/personas/persona.docs';
// import '../../modules/usuarios/usuario.docs';
// import '../../modules/cursos/curso.docs';
// import '../../modules/areas-asignadas-usuarios/area-asignada-usuario.docs';
// import '../../modules/control-data-fecha-inicio-cursada/control-data-fecha-inicio-cursada.docs';
// import '../../modules/fechas-inhabilitadas/fechas-inhabilitadas.docs';
// import '../../modules/fechas-inhabilitadas-fin/fechas-inhabilitadas-fin.docs';
// import '../../modules/instancias/instancia.docs';
// import '../../modules/historico-tutores-en-curso/historico-tutores-en-curso.docs';
// import '../../modules/argentina-feriados/argentina-feriados.docs';
// import '../../modules/datos-desarrollo/datos-desarrollo.docs';
// import '../../modules/notas-autorizacion/nota-autorizacion.docs';
// import '../../modules/cambios-estados-notas-autorizacion/cambio-estado-nota-autorizacion.docs';
// import '../../modules/coordinadores/coordinador.docs';
// import '../../modules/cc-asistencia-eventos/cc-asistencia-evento.docs';
// import '../../modules/cc-asistencia-inscriptos/cc-asistencia-inscripto.docs';
// import '../../modules/cc-asistencia-participantes/cc-asistencia-participante.docs';
// import '../../modules/avisos/aviso.docs';
// import '../../modules/efemerides/efemeride.docs';
// import '../../modules/eventos/evento.docs';
// export const generateOpenApiDocument = () => {
//   const generator = new OpenApiGeneratorV3(registry.definitions);

//   return generator.generateDocument({
//     openapi: '3.0.0',
//     info: {
//       version: '1.0.0',
//       title: 'InscribCordoba API',
//       description: 'Documentación interactiva de los endpoints migrados a TypeScript',
//     },
//     servers: [{ url: '/', description: 'Servidor Local' }],
//     security: [{ cookieAuth: [] }],
//   });
// };
