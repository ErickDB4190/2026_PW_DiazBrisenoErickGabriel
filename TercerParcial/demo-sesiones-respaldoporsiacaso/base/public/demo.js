//MENSAJE PARA JIMMY: Si lee esto y se asusta con la cantidad excesiva de comentarios fue por la razon de que al principio lei las instrucciones y como vi que dijo que no pongamos codigo que no entendamos pues mejor busque para que servia cada cosa y ya despues me arrepenti porque me di cuenta que escribi mucho, una disculpa profe :(


// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id); //esta cosa representa la pagina del html en si osea todo

//basicamente lo de aqui abajo solo consigue los elementos de el .html, erick del futuro te acuerdas de las clases del armando, pues basicamente la misma porqueria XDXDXD

const estado = document.getElementById('estado');
const cookieJS = document.getElementById('cookie-js');
const btnRefrescar = document.getElementById('btn-refrescar');

const formLogin = document.getElementById('form-login');
const usuario = document.getElementById('usuario');
const contrasena = document.getElementById('contrasena');

const bitacora = document.getElementById('bitacora');
const donde = document.getElementById('donde');
const tablaSesiones = document.getElementById('tabla-sesiones');

const btnSesiones = document.getElementById('btn-sesiones');
const config = document.getElementById('config');


//aqui esta funcion que pide literalmente todo osea las credenciales y como a mi se me olvida todo pues mejor explico lo que hace cada cosa abajo, Erick del futuro no sufriras lo mio broski

async function llamar(metodo, url, cuerpo = null) {
    const opciones = {method: metodo};
    if (cuerpo !== null) {
        opciones.headers = {
            'Content-Type': 'application/json'
        };
        opciones.body = JSON.stringify(cuerpo);
    }
    const respuesta = await fetch(url, opciones);
    
    let datos = null;
    try {
        datos = await respuesta.json();
    } catch (error) {
        datos = null;
    }
    return {
        status: respuesta.status,
        datos: datos
    };
}

/*
async: indica que la función realizará una operación que puede tardar, como esperar una respuesta del servidor y asi.
url: indica a qué dirección del servidor queremos enviar la petición.
opciones: permite enviar configuraciones adicionales. Si no mandamos ninguna, utiliza un objeto vacío (lo busque en google por eso cuesta trabajo entenderlo y peor a ti osea yo que no nos gusta leer cosas asi, XDXD porque hablo solo).
fetch(): realiza la petición al servidor.
await: espera a que termine la operación antes de continuar.
respuesta.json(): convierte la respuesta del servidor de formato JSON a un objeto que JavaScript puede utilizar.
return: devuelve la respuesta como los datos recibidos aunque eso es obvio xD.*/ 


//la función que recibe un mensaje. mas o menos la usamos como bitacora que pues de hecho es el nombre XDDD
function registrar(mensaje) {
    const elemento = document.createElement('li');

    elemento.textContent = mensaje;

    bitacora.prepend(elemento); 
}


/* 
document.createElement('li'): crea un elemento de lista HTML y pues de ahi lo de li XD.
elemento.textContent = mensaje: coloca el mensaje dentro del elemento.
bitacora.prepend(elemento): agrega el mensaje al principio de la lista.*/ 


//A partir de esta esta chido porque aqui te dice lo de si una sesion esta activa o no (osea sesion iniciada y a lo mejor sirve para ciberseguridad la neta no se xd)

async function actualizarEstado() {
    try {
        const { respuesta, datos } = await pedir('/api/sesion');

        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo consultar la sesión');
        }

        if (datos.usuario) {
            estado.textContent = `Sesión iniciada: ${datos.usuario.nombre}`;
            estado.className = 'estado con-sesion';
        } else {
            estado.textContent = 'Sin sesión';
            estado.className = 'estado sin-sesion';
        }

        cookieJS.textContent = document.cookie || '(vacío)';

    } catch (error) {
        estado.textContent = 'Error al consultar la sesión';
        cookieJS.textContent = '(no disponible)';

        registrar(`Error: ${error.message}`);
    }
}

/*async function actualizarEstado(): la función que puede esperar respuestas del servidor.

pedir('/api/sesion'): consulta la ruta que nos informa sobre la sesión.
respuesta.ok: comprueba si la petición fue exitosa.
datos.usuario: comprueba si el servidor nos devolvió información de un usuario.
textContent: cambia el texto que aparece en nuestra página.
className: cambia la clase CSS para que el estado tenga el estilo correspondiente.
document.cookie: muestra las cookies que JavaScript tiene permitido leer.
*/ 

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const { respuesta, datos } = await pedir('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario.value,
                contrasena: contrasena.value
            })
        });

        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo iniciar sesión');
        }

        registrar('Sesión iniciada correctamente');

        await actualizarEstado();

    } catch (error) {
        registrar(`Error al iniciar sesión: ${error.message}`);
    }
});

//Aqui se me hizo chido porque son cosas parecidas a las de las clases de armando con lo de addEventListener y asi

//este es el de iniciar sesion 
formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const { respuesta, datos } = await pedir('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario.value,
                contrasena: contrasena.value
            })
        });

        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo iniciar sesión');
        }

        registrar('Sesión iniciada correctamente');

        await actualizarEstado();

    } catch (error) {
        registrar(`Error al iniciar sesión: ${error.message}`);
    }
});

/*addEventListener('submit', ...): detecta cuando se envía el formulario, este es la parte que te digo Erick del futuro.
evento.preventDefault(): evita que el navegador recargue la página al enviar el formulario por lo mismo esto de que si le da sin querer pues no se pierda, como el de diep.io.
pedir('/api/login', ...): envía una petición a nuestro servidor para iniciar sesión.
method: 'POST': indica que estamos enviando información, esto lo hare con el postman.
headers: especifica que enviaremos información en formato JSON.
JSON.stringify(): convierte los datos del usuario y contraseña en texto JSON.
usuario.value: obtiene el usuario seleccionado.
contrasena.value: obtiene la contraseña escrita.
respuesta.ok: comprueba si el servidor aceptó la petición.
registrar(): muestra el resultado en nuestra bitácora.
await actualizarEstado(): vuelve a consultar la sesión para actualizar lo que vemos en pantalla.*/

// estos son los botones

document.querySelectorAll('[data-metodo][data-url]').forEach((boton) => {

    boton.addEventListener('click', async () => { //Indica que cuando alguien presione un botón, se ejecutará el código, y aqui mejor pongo los comentarios porque se ve feo como lo andaba haciendo.

        const metodo = boton.dataset.metodo;
        const url = boton.dataset.url; //Obtiene los valores que escribimos en el HTML.

        try {
            const { respuesta, datos } = await pedir(url, {
                method: metodo
            }); //Utiliza nuestra función de digamos la parte 2 osea la segunda parte donde puse los comentarios para comunicarse con el servidor.

            if (!respuesta.ok) {
                throw new Error(datos.error || 'La petición falló');
            }

            registrar(`${metodo} ${url}: ${JSON.stringify(datos)}`); //Muestra en la bitácora qué petición hicimos y qué respondió el servidor.

            await actualizarEstado();

        } catch (error) {
            registrar(`Error en ${metodo} ${url}: ${error.message}`);
        }
    });

});


//// basicamente aqui es que agarramos todos los botones que tienen método y dirección URL

document.querySelectorAll('[data-metodo][data-url]').forEach((boton) => {

    // Detectamos cuando el usuario hace clic en alguno de los botones (igual mejor puse aqui los comentarios porque otra vez se veian feos arriba)
    boton.addEventListener('click', async () => {

        // Obtenemos el método (GET o POST) y la dirección del botón
        const metodo = boton.dataset.metodo;
        const url = boton.dataset.url;

        try {
            //Enviamos la petición al servidor usando los datos del botón
            const { respuesta, datos } = await pedir(url, {
                method: metodo
            });

            //Aca compruebas  si el servidor respondió correctamente y si no pues te manda error
            if (!respuesta.ok) {
                throw new Error(datos.error || 'La petición falló');
            }

            //Mostramos en la bitácora la petición y su resultado
            registrar(`${metodo} ${url}: ${JSON.stringify(datos)}`);

            //Actualizamos la información de nuestra sesión
            await actualizarEstado();

        } catch (error) {
            //aca mostramos el error en la bitácora
            registrar(`Error en ${metodo} ${url}: ${error.message}`);
        }
    });

});

//Aqui la funcion nos va a decir donde se estan guardando las sesiones
async function actualizarAlmacen() {
    try {
        //Le preguntamos al servidor donde esta guardando las sesiones
        const { respuesta, datos } = await pedir('/api/diagnostico');

        //Si algo sale mal, mostramos el error que nos mande el servidor
        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo consultar el almacenamiento');
        }

        // Aqui mostramos el lugar donde se estan guardando las sesiones
        donde.textContent = datos.almacen || 'No se pudo identificar el almacenamiento';

    } catch (error) {
        // Si no se pudo consultar mandamos esto
        donde.textContent = 'Error al consultar el almacenamiento';

        
        registrar(`Error al consultar el almacenamiento: ${error.message}`);
    }
}

// Esta funcion sirve para mostrar las sesiones que tiene guardadas el servidor
async function actualizarSesiones() {
    try {
        // Le pedimos al servidor la lista de sesiones que tiene guardadas
        const { respuesta, datos } = await pedir('/api/diagnostico');

        // Revisamos si la peticion salio bien
        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudieron obtener las sesiones');
        }

        // Primero limpiamos la tabla para no repetir los datos anteriores que luego se traba xD
        tablaSesiones.innerHTML = '';

        // Recorremos todas las sesiones que nos mando el servidor
        datos.sesiones.forEach((sesion) => {

            // Creamos una nueva fila para cada sesion y otra vez por eso el tr xD como el li de arriba
            const fila = document.createElement('tr');

            // Agregamos los datos de la sesion en sus respectivas columnas
            const valores = [
                sesion.id,
                sesion.usuario,
                sesion.visitas,
                sesion.vence
            ];

            //lo mismo pero con td
            valores.forEach((valor) => {
                const celda = document.createElement('td');

                // Ponemos el valor dentro de cada celda
                celda.textContent = valor ?? '—';

                // Agregamos la celda a la fila
                fila.appendChild(celda);
            });

            // Finalmente agregamos la fila a nuestra tabla
            tablaSesiones.appendChild(fila);
        });

        // Y sI No hay sesiones, mostramos un mensaje en la tabla
        if (datos.sesiones.length === 0) {
            tablaSesiones.innerHTML = '<tr><td colspan="4">(sin sesiones)</td></tr>';
        }

    } catch (error) {
        registrar(`Error al actualizar las sesiones: ${error.message}`);
    }
}

//  Esta funcion muestra la configuracion que estamos usando
async function actualizarConfig() {
    try {
        // Le pedimos al servidor la configuracion actual
        const { respuesta, datos } = await pedir('/api/config');

        // Revisamos que el servidor nos haya respondido correctamente
        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo obtener la configuracion');
        }

        // Mostramos la configuracion de forma ordenada para que sea facil leerla
        config.textContent = JSON.stringify(datos, null, 2);

    } catch (error) {
        
        config.textContent = 'No se pudo cargar la configuracion';

        //igual todo lo que aparece como registrar es para que se vaya anotando al segundo metodo de este documento
        registrar(`Error al consultar la configuracion: ${error.message}`);
    }
} //Igual acuerdate que los JSON.stringify convierte los datos en texto que luego te lo preguntan en clase.

//Aqui conectamos los botones para que podamos actualizar la informacion

// Este es el boton que vuelve a consultar como esta nuestra sesion
btnRefrescar.addEventListener('click', () => {
    actualizarEstado();
});

// Este es el boton que vuelve a cargar la informacion de las sesiones guardadas
btnSesiones.addEventListener('click', () => {
    actualizarSesiones();
});

// este es el metodo que uso una cosa nueva osea el DOMContentLoaded
// este hace que esperamos a que el HTML de la página termine de cargarse antes de ejecutar estas funciones. Cuando abrimos la pagina, cargamos toda la informacion automaticamente
document.addEventListener('DOMContentLoaded', () => {

    // Primero revisamos si tenemos una sesion iniciada
    actualizarEstado();

    // Consultamos donde se estan guardando las sesiones
    actualizarAlmacen();

    // Cargamos las sesiones que tiene guardadas el servidor
    actualizarSesiones();

    // Tambien mostramos la configuracion que estamos utilizando
    actualizarConfig();
    registrar('Pagina cargada correctamente');
});

