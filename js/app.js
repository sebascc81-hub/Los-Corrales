// CONFIGURACIÓN DE TU API
const API_URL = "https://script.google.com/macros/s/AKfycbwSxe7Cv6YNqzZzxGI_fM_nvlRQczsbXVRCAUnMIAUTKFoeoXLXh7HjpgJrLC5AMPBV/exec";

let inventarioPrecios = {};

// --- PESTAÑAS ---
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'ventas') btns[0].classList.add('active');
    if(tabName === 'gastos') btns[1].classList.add('active');
    if(tabName === 'productos') btns[2].classList.add('active');
}

// --- CONEXIÓN API ---
async function cargarMenu() {
    try {
        const response = await fetch(`${API_URL}?action=leerMenu`);
        const data = await response.json();
        
        const dataList = document.getElementById('lista-productos');
        dataList.innerHTML = '';
        inventarioPrecios = {};

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.descripcion;
            dataList.appendChild(option);
            inventarioPrecios[item.descripcion] = item.precio;
        });
    } catch (error) {
        console.error("Error menu:", error);
    }
}

async function enviarDatos(datos) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = 'Guardando...';
    statusDiv.style.color = 'blue';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(datos)
        });
        const result = await response.json();
        
        if(result.status === "success") {
            statusDiv.textContent = '¡Guardado!';
            statusDiv.style.color = 'green';
            setTimeout(() => statusDiv.textContent = '', 3000);
            return true;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        statusDiv.textContent = 'Error: ' + error.message;
        statusDiv.style.color = 'red';
        return false;
    }
}

// --- LISTENERS ---
document.getElementById('ventas-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        action: "guardarVenta",
        cliente: document.getElementById('venta-cliente').value,
        producto: document.getElementById('venta-producto').value,
        valor: document.getElementById('venta-valor').value,
        pago: document.getElementById('venta-pago').value,
        observacion: document.getElementById('venta-observacion').value
    };
    if(await enviarDatos(data)) document.getElementById('ventas-form').reset();
});

document.getElementById('gastos-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        action: "guardarGasto",
        proveedor: document.getElementById('gasto-proveedor').value,
        valor: document.getElementById('gasto-valor').value,
        pago: document.getElementById('gasto-pago').value,
        observacion: document.getElementById('gasto-observacion').value
    };
    if(await enviarDatos(data)) document.getElementById('gastos-form').reset();
});

document.getElementById('productos-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        action: "guardarProducto",
        codigo: document.getElementById('prod-codigo').value,
        descripcion: document.getElementById('prod-descripcion').value,
        precio: document.getElementById('prod-precio').value
    };
    if(await enviarDatos(data)) {
        document.getElementById('productos-form').reset();
        cargarMenu();
    }
});

function autocompletarPrecio() {
    const prod = document.getElementById('venta-producto').value;
    if(inventarioPrecios[prod]) {
        document.getElementById('venta-valor').value = inventarioPrecios[prod];
    }
}

cargarMenu();