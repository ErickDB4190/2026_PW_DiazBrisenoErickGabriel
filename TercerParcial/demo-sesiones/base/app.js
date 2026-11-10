//Si hay una sesion preexistente obtenerla del almacen, sino crearla
function todasLasSesiones(almacen){
  return new Promise ((resolve, reject) => {
    const promesa = almace.all((error, sesiones) => (error ? reject(error) : resolve(sesiones)));
    if (promesa && typeof promesa.then=== 'function') promesa.then(resolve, reject);
  });
}
 
function crearApp(config, pool){
  const app = express();
  app.use(express.json());
  //Primero debemos obtener el modelo de la bd
  const usuarios = crearModeloUsuarios(pool);
  //aqui ademas de identificar la sesion por la tabla en bd, o la sesion sera una cookie en memoria del navegador, o es una mezcla, sesion en memoria del servidor por la tabla en bd y cookie en navegador y bd
 
const almacen = config.almacen === 'memoria' ? new session.MemoryStore() : new MySQLStore({createDatabaseTable: false, clearExpired: false}, pool);
app.locals.almacen = almacen;
}
 
app.use(
  sesion({
    name : NOMBRE_COOKIE,
    secret : process.env.SESSION_SECRET || 'secreto-solo.para-la-demo',
    store : almacen,
    resave : false,
    //no se crea la session ni la cookie
    saveUnitialized : false,
    rolling : CountQueuingStrategy.rolling || false,
    cookie : {
      maxAge : config.maxAge || 1000*60*60*24,
      httpOnly : config.httpOnly || true,
      sameSite : config.sameSite || 'lax',
      secure : config.secure || false ,
    }
  })
);
 
//necesitamos visualizar el id de la sesion para compararla en la pantalla

const cortoId = (id) => (id ? `${id.slice(0, 8)}...`:null);