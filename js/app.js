const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault();

    //Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //Consultar la API
    consultarAPI(ciudad, pais);
}


function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if (!alerta) {
        //Crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class='font-bold'>Error!</strong>
        <span class='block'>${mensaje}</span>
    `
        container.appendChild(alerta);

        //eliminar alerta
        setTimeout(() => {
            alerta.remove();
        }, 5000)
    }

}

function consultarAPI(ciudad, pais) {
    const appId = '81632d81a7a32ee120c890faffb345c7';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    Spinner();//Muestra un spinner de carga

    fetch(url)
        .then(response => response.json())
        .then(datos => {
            limpiarHTML();
            if (datos.cod === '404') {
                mostrarError('Ciudad no encontrada');
                return;
            }

            //mostrar respuesta en el HTML
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const { name , main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerText = `Temperatura Max: ${max} ℃`;
    tempMaxima.classList.add('text-xl');

    
    const tempMinima = document.createElement('p');
    tempMinima.innerText = `Temperatura Min: ${min} ℃`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-cube-grid');

    divSpinner.innerHTML = `
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>    
    `
    resultado.appendChild(divSpinner);
}