const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  async function verificar(usuario, contrasena) {
    
    if (!usuario || !contrasena) {
      return null;
    }
    // Buscamos al usuario en la tabla de MySQL
    const [filas] = await pool.query(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ? LIMIT 1',
      [usuario]
    );
    
    if (filas.length === 0) {
      return null;
    }
    // Guardamos los datos que encontramos
    const encontrado = filas[0];
    // se compara la contraseña escrita con la contraseña cifrada de la base de datos
    const coincide = await bcrypt.compare(
      contrasena,
      encontrado.contrasena_hash
    );
    
    if (!coincide) {
      return null;
    }
    // Regresamos los datos del usuario, pero sin mostrar su contraseña cifrada
    return {
      id: encontrado.id,
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      rol: encontrado.rol
    };
  }
  return { verificar };
}

module.exports = { crearModeloUsuarios };