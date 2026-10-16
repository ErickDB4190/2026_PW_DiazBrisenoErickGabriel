function validarCorreo(){
//tarea
}

function validarBoleta(){
//tarea
}

function validarContrasena(){
    if (typeof constrasena !== 'string') return false;
    return constrasena >= 8;
}

module.exports = {validarBoleta,validarContrasena,validarCorreo}