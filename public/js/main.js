document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos');
  
    // Función para cargar la lista de productos desde el backend
    async function cargarProductos() {
      try {
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();
  
        // Renderizar la lista de productos
        productos.forEach(producto => {
          const productoElement = document.createElement('div');
          productoElement.innerHTML = `
            <p>${producto.nombre} - $${producto.precio}</p>
            <button class="comprar-btn" data-product-id="${producto.id}">Comprar</button>
          `;
          productosContainer.appendChild(productoElement);
        });
  
        // Asignar eventos de clic después de agregar los elementos al DOM
        const comprarButtons = document.querySelectorAll('.comprar-btn');
        comprarButtons.forEach(button => {
          button.addEventListener('click', () => {
            comprar(parseInt(button.dataset.productId));
          });
        });
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
  
    // Función para procesar la compra
    async function comprar(productId) {
      const cantidad = prompt('Ingrese la cantidad a comprar:');
      if (cantidad && !isNaN(cantidad)) {
        try {
          const response = await fetch('http://localhost:3000/comprar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, cantidad: parseInt(cantidad) })
          });
  
          const resultado = await response.json();
          alert(resultado.mensaje);
        } catch (error) {
          console.error('Error al procesar la compra:', error);
        }
      } else {
        alert('Ingrese una cantidad válida.');
      }
    }
  
    // Cargar productos al cargar la página
    cargarProductos();
  });
  