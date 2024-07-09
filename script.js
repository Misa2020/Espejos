document.addEventListener('DOMContentLoaded', function() {
    const tipoEspejoSelect = document.getElementById('tipoEspejo');
    const precioMetroCuadradoInput = document.getElementById('precioMetroCuadrado');
    const lucesLedCheckbox = document.getElementById('lucesLed');
    const opcionesLed = document.getElementById('opcionesLed');
    const luzRgbCheckbox = document.getElementById('luzRgb');
    const luzUnColorCheckbox = document.getElementById('luzUnColor');
    const botonTouchCheckbox = document.getElementById('botonTouch');
    const sistemaInstalacionCheckbox = document.getElementById('sistemaInstalacion');

    function actualizarPrecioMetroCuadrado() {
        switch (tipoEspejoSelect.value) {
            case 'cuadradoRectangular':
                precioMetroCuadradoInput.value = 30;
                break;
            case 'irregular':
                precioMetroCuadradoInput.value = 40;
                break;
            case 'arenado':
                precioMetroCuadradoInput.value = 45; // Asumimos un precio para espejos arenados
                break;
            default:
                precioMetroCuadradoInput.value = '';
        }
    }

    tipoEspejoSelect.addEventListener('change', actualizarPrecioMetroCuadrado);

    lucesLedCheckbox.addEventListener('change', function() {
        opcionesLed.style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            sistemaInstalacionCheckbox.checked = true;
        } else {
            luzRgbCheckbox.checked = false;
            luzUnColorCheckbox.checked = false;
            botonTouchCheckbox.checked = false;
        }
    });

    function uncheckOthers(checkedBox) {
        const checkboxes = [luzRgbCheckbox, luzUnColorCheckbox, botonTouchCheckbox];
        checkboxes.forEach(checkbox => {
            if (checkbox !== checkedBox) {
                checkbox.checked = false;
            }
        });
    }

    function actualizarTipoEspejo() {
        if (botonTouchCheckbox.checked && 
            (tipoEspejoSelect.value === 'cuadradoRectangular' || tipoEspejoSelect.value === 'irregular')) {
            tipoEspejoSelect.value = 'arenado';
            actualizarPrecioMetroCuadrado();
        }
    }

    luzRgbCheckbox.addEventListener('change', function() {
        if (this.checked) uncheckOthers(this);
    });

    luzUnColorCheckbox.addEventListener('change', function() {
        if (this.checked) uncheckOthers(this);
    });

    botonTouchCheckbox.addEventListener('change', function() {
        if (this.checked) {
            uncheckOthers(this);
            actualizarTipoEspejo();
        }
    });

    document.getElementById('calculatorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tipoEspejo = tipoEspejoSelect.value;
        const precioMetroCuadrado = parseFloat(precioMetroCuadradoInput.value);
        const alto = parseFloat(document.getElementById('alto').value) / 100; // Convertir cm a metros
        const ancho = parseFloat(document.getElementById('ancho').value) / 100; // Convertir cm a metros
        const sistemaInstalacion = sistemaInstalacionCheckbox.checked;
        const lucesLed = lucesLedCheckbox.checked;
        const luzRgb = luzRgbCheckbox.checked;
        const luzUnColor = luzUnColorCheckbox.checked;
        const botonTouch = botonTouchCheckbox.checked;
        
        if (!tipoEspejo || isNaN(precioMetroCuadrado)) {
            alert('Por favor, seleccione un tipo de espejo válido.');
            return;
        }
        
        const area = alto * ancho;
        const perimetro = 2 * (alto + ancho); // Cálculo del perímetro para las luces
        let precioFinal = area * precioMetroCuadrado;
        
        if (sistemaInstalacion || lucesLed) {
            precioFinal += 15; // Siempre se suma si hay luces LED o sistema de instalación
        }
        
        let detallesLuces = [];
        
        if (lucesLed) {
            if (luzRgb) {
                precioFinal += 6 + (3.5 * perimetro);
                detallesLuces.push('Luz RGB');
            } else if (luzUnColor) {
                precioFinal += 4 + (2.5 * perimetro);
                detallesLuces.push('Luz un color');
            } else if (botonTouch) {
                precioFinal += 30 + (5 * perimetro);
                detallesLuces.push('Botón touch');
            }
        }
        
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `
            <h2>Resultado:</h2>
            <p>Tipo de espejo: ${tipoEspejo}</p>
            <p>Área del espejo: ${area.toFixed(2)} m²</p>
            <p>Perímetro del espejo: ${perimetro.toFixed(2)} m</p>
            <p>Precio final: ${precioFinal.toFixed(2)} €</p>
            ${sistemaInstalacion || lucesLed ? '<p>Incluye sistema de instalación</p>' : ''}
            ${lucesLed && detallesLuces.length > 0 ? `<p>Incluye luces LED: ${detallesLuces.join(', ')}</p>` : ''}
        `;
    });
});