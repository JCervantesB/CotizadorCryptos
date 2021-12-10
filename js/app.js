const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(crypto => {
        const { FullName, Name } = crypto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    // Consultar API
    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('.error');

    if (!existeError) {

        const alerta = document.createElement('P');
        alerta.classList.add('error');
        alerta.textContent = mensaje;

        resultado.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variación últimas 24h: <span id="porcentaje">${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;

    setTimeout(() => {

        const color = document.querySelector('#porcentaje');
        if (CHANGEPCT24HOUR < 0) {
            color.classList.add('rojo');
        } else {
            color.classList.add('verde');
        }
    }, 500);

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}