//MENSAJE PARA JIMMY: Si lee esto y se asusta con la cantidad excesiva de comentarios fue por la razon de que al principio lei las instrucciones y como vi que dijo que no pongamos codigo que no entendamos pues mejor busque para que servia cada cosa y ya despues me arrepenti porque me di cuenta que escribi mucho, una disculpa profe :(

//PD: algunos comentarios eran de codigos que habia usado anteriormente y los iba corrigiendo porque me salian errores, me tomo 3 intentos hacer todo y volverlo a rehacer y para saber cuales son los comentarios que debo borrar me iba a tomar mas tiempo, igual los deje ahi por si me sirven en un futuro, una disculpa :(

// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id); //esta cosa representa la pagina del html en si osea todo

//basicamente lo de aqui abajo solo consigue los elementos de el .html, erick del futuro te acuerdas de las clases del armando, pues basicamente la misma cosa XDXDXD

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
        opciones.headers = {'Content-Type': 'application/json' };
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
function registrar(status, metodo, url, datos) {
    const elemento = document.createElement('li');
    // Cree un nuevo elemento de lista para la digamos bitacora

    if (typeof status === 'number') { //aca las condiciones de basicamente los errores, osea de cuales son y asi
        elemento.className = status >= 200 && status < 300 ? 'codigo ok' : status === 401 ? 'codigo e401' : status === 403 ? 'codigo e403' : 'codigo error';

        elemento.textContent =
            `${status} | ${metodo} ${url} | ${JSON.stringify(datos)}`;
        // Muestra el código , el método, la ruta y la respuesta, espero y funcione.
    } else {
        elemento.textContent = status;
        // Aqui es donde se registran los errores.
    }

    bitacora.prepend(elemento);
    
}


/* 
document.createElement('li'): crea un elemento de lista HTML y pues de ahi lo de li XD.
elemento.textContent = mensaje: coloca el mensaje dentro del elemento que es para que se enseñe en si en la pagina.
bitacora.prepend(elemento): agrega el mensaje al principio de la lista.*/ 


//A partir de esta esta chido porque aqui te dice lo de si una sesion esta activa o no (osea sesion iniciada y a lo mejor sirve para ciberseguridad la neta no se xd)

async function actualizarEstado() {
    try {
        const { status, datos } = await llamar('GET', '/api/sesion');

        if (status === 200) {
            estado.textContent =
                `Sesión iniciada: ${datos.usuario.nombre} | Rol: ${datos.usuario.rol} | Sesión: ${datos.sesion} | Expira en: ${datos.expiraEnSegundos} segundos`;

            estado.className = 'estado con-sesion';

        } else if (status === 401) {
            estado.textContent = 'Sin sesión iniciada';
            estado.className = 'estado sin-sesion';

        } else {
            throw new Error(datos?.error || 'No se pudo consultar la sesión');
        }

        cookieJS.textContent = document.cookie || '(vacío)';

    } catch (error) {
        estado.textContent = 'Error al consultar la sesión';
        estado.className = 'estado sin-sesion';
        cookieJS.textContent = '(no disponible)';

        registrar(`Error: ${error.message}`);
    }
}

/*async function actualizarEstado(): la función que puede esperar respuestas del servidor.

('/api/sesion'): consulta la ruta que nos informa sobre la sesión.
respuesta.ok: comprueba si la petición fue exitosa.
datos.usuario: comprueba si el servidor nos devolvió información de un usuario.
textContent: cambia el texto que aparece en nuestra página.
className: cambia la clase CSS para que el estado tenga el estilo correspondiente.
document.cookie: muestra las cookies que JavaScript tiene permitido leer.
*/ 



//Aqui se me hizo chido porque son cosas parecidas a las de las clases de armando con lo de addEventListener y asi

//este es el de iniciar sesion 
formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const { status, datos } = await llamar('POST', '/api/login', {
            usuario: usuario.value,
            contrasena: contrasena.value
        });

        if (status !== 200) {
            throw new Error(datos?.error || 'No se pudo iniciar sesión');
        }

        registrar(`Inicio de sesión correcto: ${datos.usuario.nombre}`);

        await actualizarEstado();
        await actualizarSesiones();

    } catch (error) {
        registrar(`Error al iniciar sesión: ${error.message}`);
    }
});

/*addEventListener('submit', ...): detecta cuando se envía el formulario, este es la parte que te digo Erick del futuro.
evento.preventDefault(): evita que el navegador recargue la página al enviar el formulario por lo mismo esto de que si le da sin querer pues no se pierda, como el de diep.io.
('/api/login', ...): envía una petición a nuestro servidor para iniciar sesión.
method: 'POST': indica que estamos enviando información, esto lo hare con el postman.
headers: especifica que enviaremos información en formato JSON.
JSON.stringify(): convierte los datos del usuario y contraseña en texto JSON.
usuario.value: obtiene el usuario seleccionado.
contrasena.value: obtiene la contraseña escrita.
respuesta.ok: comprueba si el servidor aceptó la petición.
registrar(): muestra el resultado en nuestra bitácora.
await actualizarEstado(): vuelve a consultar la sesión para actualizar lo que vemos en pantalla.*/

// estos son los botones (los de abajo xD)

document.querySelectorAll('[data-metodo][data-url]').forEach((boton) => {

    boton.addEventListener('click', async () => { 
        // Indica que cuando alguien presione un botón, se ejecutará el código(mejor asi pongo los comentarios porque se veia feo los de arriba).

        const metodo = boton.dataset.metodo;
        const url = boton.dataset.url; 
        // Obtiene los valores que escribimos en el HTML.

        try {
            const { status, datos } = await llamar(metodo, url);
            // Utiliza nuestra función llamar() para comunicarse con el servidor.
            // Recibe el código de respuesta (status) y los datos que devuelve.

            registrar(status, metodo, url, datos);
            // Muestra en la bitácora qué petición hicimos y qué respondió el servidor.

            await actualizarEstado();
            // Actualiza la información de la sesión después de realizar la petición.

            await actualizarSesiones();
            // Actualiza la tabla con las sesiones registradas.

        } catch (error) {
            registrar(`Error en ${metodo} ${url}: ${error.message}`);
            // Muestra en la bitácora si ocurrió algún error.
        }
    });

});




//Aqui la funcion nos va a decir donde se estan guardando las sesiones porque sino pues no sabemos XD
async function actualizarAlmacen() {
    try {
        const { status, datos } = await llamar('GET', '/api/diagnostico/sesiones');

        if (status !== 200) {
            throw new Error(datos?.error || 'No se pudo consultar el almacenamiento');
        }

        donde.textContent = `Almacenamiento de sesiones: ${datos.almacen}`;

        registrar(status, 'GET', '/api/diagnostico/sesiones', datos);

    } catch (error) {
        donde.textContent = 'No se pudo consultar el almacenamiento';
        registrar(`Error al consultar el almacenamiento: ${error.message}`);
    }
}

// Esta funcion sirve para mostrar las sesiones que tiene guardadas el servidor
async function actualizarSesiones() {
    try {
        const { status, datos } = await llamar('GET', '/api/diagnostico/sesiones');
        // Solicita al servidor la información de las sesiones registradas.

        if (status !== 200) {
            throw new Error(datos?.error || 'No se pudieron consultar las sesiones');
        }

        const tabla = document.getElementById('tabla-sesiones');
        tabla.innerHTML = '';
        

        datos.sesiones.forEach((sesion) => {
           

            const fila = document.createElement('tr');

            const valores = [
                sesion.sesion,
                sesion.esLaTuya ? 'Sí' : 'No',
                sesion.usuario,
                sesion.visitas,
                sesion.expira
                    ? new Date(sesion.expira).toLocaleString()
                    : 'Sin fecha'
            ];

            valores.forEach((valor) => {
                const celda = document.createElement('td');
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            tabla.appendChild(fila);
            // Agrega la fila completa a la tabla por algo puse lo de td y tr aca arriba supongo que puedes deducirlo por logica Erick del futuro w
        });

    } catch (error) {
        registrar(`Error al consultar sesiones: ${error.message}`);
    }
}

//  Esta funcion muestra la configuracion que estamos usando
async function actualizarConfig() {
    try {
        const { status, datos } = await llamar('GET', '/api/config');
        // Solicita al servidor la configuración de la práctica.

        if (status !== 200) {
            throw new Error(datos?.error || 'No se pudo obtener la configuración');
        }

        config.textContent = JSON.stringify(datos, null, 2);
        // Muestra la configuración en pantalla de forma organizada, osea el que aparece lo de la cosa esta se me fue el nombre pero a la derecha.

        registrar(status, 'GET', '/api/config', datos);
        

    } catch (error) {
        config.textContent = 'No se pudo cargar la configuración';
        registrar(`Error al consultar la configuración: ${error.message}`);
    }
} //Igual acuerdate que los JSON.stringify convierte los datos en texto que luego te lo preguntan en clase.

//Aqui conectamos los botones para que podamos actualizar la informacion

// Este es el boton que vuelve a consultar como esta nuestra sesion
btnRefrescar.addEventListener('click', async () => {
    //literalmente actualiza el estado de la sesion XD
    await actualizarEstado();
});

// Este es el boton que vuelve a cargar la informacion de las sesiones guardadas
btnSesiones.addEventListener('click', async () => {
    // esta cosa actualiza la información de las sesiones 
    await actualizarAlmacen();
    await actualizarSesiones();
});
// me acuerdo que encontre una cosa que era el DOMContentLoaded
// Que hacia que esperamos a que el HTML de la página termine de cargarse antes de ejecutar estas funciones. Cuando abrimos la pagina, cargamos toda la informacion automaticamente casi como una pantalla de carga de las que luego ponen y asi
//pero honestamente descubri que no era tan necesario y mejor hice lo de aqui abajo.
async function refrescarTodo() {
    await actualizarEstado();
    await actualizarAlmacen();
    await actualizarSesiones();
    await actualizarConfig();

    registrar('Página cargada correctamente');
    
}

refrescarTodo(); //y pues ya literalmente carga todo xD

