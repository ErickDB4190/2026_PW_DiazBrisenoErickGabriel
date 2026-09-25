const talleres = [
    { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
    { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
    { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
    { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

function pintarTabla() {
    const tabla = document.getElementById('tabla-cuerpo');

    tabla.innerHTML = '';

    talleres.forEach((taller) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${taller.nombre}</td>
            <td>${taller.instructor}</td>
            <td>${taller.cupo}</td>
            <td>${taller.inscritos}</td>
        `;

        tabla.appendChild(fila);
    });
}

const formularioArreglos = document.getElementById('form-arreglos');
const resArreglos = document.getElementById('resultado-arreglo');
const OperacionArreglo = document.getElementById('operacion-arreglo');

formularioArreglos.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const op = OperacionArreglo.value;

    let resultado;

    switch(op){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} ${t.instructor} (${t.inscritos}/${t.cupo})`).join('\n');
            break;
        case 'map':
            resultado = talleres.map((t) => t.nombre).join(', ');
            break;
        case 'filter':
            resultado = talleres.filter((t) => t.inscritos >= t.cupo).map((t) => t.nombre).join(', ');
            break;
        case 'find':
            const tallerMaria = talleres.find((t) => t.instructor === 'Ing. María López');
            resultado = tallerMaria ? `${tallerMaria.nombre} (${tallerMaria.inscritos}/${tallerMaria.cupo})` : 'No existe ningún taller en el que se dé clases por la Ing. María López';
            break;
    }
    resArreglos.textContent = resultado;
    pintarTabla();
});

// Carga la tabla automáticamente al abrir la página o algo asi segun lo que investigue XD
pintarTabla();

//segunda parte

const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto.addEventListener('submit', (evento) =>{

    evento.preventDefault();

    //construimos el objeto de talleres
    const taller = {
        nombre : document.getElementById('obj-nombre'),
        instructor : document.getElementById('obj-instructor').value,
        cupo : Number(document.getElementById('obj-cupo').value),
        instructor : Number(document.getElementById('obj-instructor').value)
    };

    const operacion = document.getElementById('operacion-objeto').value;

    let resultado;

    switch(operacion){
        case 'keys':
            resultado = JSON.stringify(Object.keys(taller));
            break;
        case 'values':

            break;
        case 'entries':
            resultado = Object.entries(taller).map(([campo,valor]) => `$(campo):$(valor)`).join('\n');
            break;
        case 'stringify':

            break;
        case 'roundtrip':
            break;
    }

    resultadoObjeto.textContent = resultado;
})