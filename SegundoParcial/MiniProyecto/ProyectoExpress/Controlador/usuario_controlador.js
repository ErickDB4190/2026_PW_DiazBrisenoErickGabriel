const bcrypt = require('bcryptjs');

const usuariosModel = require('../Modelo/usuario_modelo');

const {validarCorre, validarBoleta, validarContrasena} = require('../validaciones')