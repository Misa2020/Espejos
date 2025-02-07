// Configuración de precios base
const PRECIOS = {
    cuadradoRectangular: 30,  // Precio por m²
    irregular: 40,            // Precio por m²
    arenado: 43,             // Precio por m²
    luzRgb: {
        base: 6,
        porMetro: 3.50
    },
    luzUnColor: {
        base: 4,
        porMetro: 3.50
    },
    botonTouch: {
        base: 40,
        porMetro: 5
    },
    instalacion: {
        soportes: 6,
        flotante: 15
    },
    marco: {
        pvc: 4,    // por metro
        metal: 12  // por metro
    }
};

// Cache de elementos DOM
const elementos = {
    tipoEspejo: document.getElementById('tipoEspejo'),
    alto: document.getElementById('alto'),
    ancho: document.getElementById('ancho'),
    tipoMarco: document.getElementById('tipoMarco'),
    tipoInstalacion: document.getElementById('tipoInstalacion'),
    grupoLuces: document.getElementById('grupoLuces'),
    tipoLuz: document.getElementById('tipoLuz'),
    acabado: document.getElementById('acabado'),
    resultado: document.getElementById('resultado')
};

// Funciones auxiliares
function convertirCmAMetros(valorCm) {
    return (parseFloat(valorCm) || 0) / 100;
}

function calcularDimensiones() {
    const alto = convertirCmAMetros(elementos.alto.value);
    const ancho = convertirCmAMetros(elementos.ancho.value);
    return {
        area: alto * ancho,
        perimetro: 2 * (alto + ancho)
    };
}

function actualizarOpcionesMarco() {
    const opciones = ['<option value="ninguno">Sin marco</option>'];

    if (elementos.tipoEspejo.value === 'regular') {
        opciones.push(
            '<option value="pvc">Marco PVC</option>',
            '<option value="metal">Marco Metálico</option>'
        );
    } else if (elementos.tipoEspejo.value === 'irregular') {
        opciones.push('<option value="pvc">Marco PVC</option>');
    }

    elementos.tipoMarco.innerHTML = opciones.join('');
}

function actualizarOpcionesLuz() {
    const esInstalacionSoportes = elementos.tipoInstalacion.value === 'soportes';
    elementos.grupoLuces.classList.toggle('disabled', esInstalacionSoportes);
    elementos.tipoLuz.disabled = esInstalacionSoportes;

    if (esInstalacionSoportes) {
        elementos.tipoLuz.value = 'ninguna';
    }
}

function calcularPrecioBase(area, tipoEspejo) {
    return tipoEspejo === 'regular' ?
        PRECIOS.cuadradoRectangular * area :
        PRECIOS.irregular * area;
}

function calcularPrecioAcabado(area, acabado) {
    return acabado === 'arenado' ?
        (PRECIOS.arenado - PRECIOS.cuadradoRectangular) * area : 0;
}

function calcularPrecioInstalacion(tipoInstalacion) {
    return PRECIOS.instalacion[tipoInstalacion] || 0;
}

function calcularPrecioMarco(perimetro, tipoMarco) {
    if (tipoMarco === 'pvc') return PRECIOS.marco.pvc * perimetro;
    if (tipoMarco === 'metal') return PRECIOS.marco.metal * perimetro;
    return 0;
}

function calcularPrecioLuz(perimetro, tipoLuz) {
    switch (tipoLuz) {
        case 'rgb':
            return PRECIOS.luzRgb.base + (PRECIOS.luzRgb.porMetro * perimetro);
        case 'simple':
            return PRECIOS.luzUnColor.base + (PRECIOS.luzUnColor.porMetro * perimetro);
        case 'touch':
            return PRECIOS.botonTouch.base + (PRECIOS.botonTouch.porMetro * perimetro);
        default:
            return 0;
    }
}

function calcularPrecio() {
    const { area, perimetro } = calcularDimensiones();

    if (area <= 0 || perimetro <= 0) {
        elementos.resultado.innerHTML = 'Por favor, ingrese dimensiones válidas';
        return;
    }

    const precioTotal =
        calcularPrecioBase(area, elementos.tipoEspejo.value) +
        calcularPrecioAcabado(area, elementos.acabado.value) +
        calcularPrecioInstalacion(elementos.tipoInstalacion.value) +
        calcularPrecioMarco(perimetro, elementos.tipoMarco.value) +
        calcularPrecioLuz(perimetro, elementos.tipoLuz.value);

    elementos.resultado.innerHTML = `
        Precio total: $${precioTotal.toFixed(2)}<br>
        Área: ${area.toFixed(2)} m²<br>
        Perímetro: ${perimetro.toFixed(2)} metros
    `;
}

// Event listeners
function inicializarEventListeners() {
    elementos.tipoEspejo.addEventListener('change', () => {
        actualizarOpcionesMarco();
        calcularPrecio();
    });

    elementos.tipoInstalacion.addEventListener('change', () => {
        actualizarOpcionesLuz();
        calcularPrecio();
    });

    const elementosConChange = ['alto', 'ancho', 'tipoLuz', 'tipoMarco', 'acabado'];
    elementosConChange.forEach(id => {
        elementos[id].addEventListener('input', calcularPrecio);
    });
}

// Inicialización
function inicializar() {
    actualizarOpcionesMarco();
    actualizarOpcionesLuz();
    inicializarEventListeners();
    calcularPrecio();
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);