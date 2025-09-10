async function cargarProductos() {
    try {
      const response = await fetch("http://api-una-negra.mine.nu:9090/api/get");
      const productos = await response.json();
  
      const contenedor = document.getElementById("productos");
      contenedor.innerHTML = "";
  
      productos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="http://api-una-negra.mine.nu:9090/api/images/${p.imagePath}" alt="${p.producto}">
          <div class="card-body"> 
            <p class="title_card">${p.producto}</p>
            <br>
            <p class="price_card"><strong>Precio: $${p.precio}</strong></p>
            <br><br>
          </div>
          <button class="btn-comprar" data-id="${p.id}">Comprar Ahora</button>
        `;
        contenedor.appendChild(card);
  
        // botón comprar
        const boton = card.querySelector(".btn-comprar");
        boton.addEventListener("click", () => {
            const mensaje = `Buenas, me gustaría consultar sobre el siguiente producto: ${p.producto}`;
            const url = `https://api.whatsapp.com/send?phone=59898582316&text=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank");
        });
  
        // evento en la tarjeta (excepto el botón)
        card.addEventListener("click", (e) => {
          if (!e.target.classList.contains("btn-comprar")) {
            Swal.fire({
              title: p.producto,
              html: `<p style="text-align: justify;">${p.descripcion}</p>`,
              confirmButtonText: 'Cerrar'
            });
          }
        });
      });
  
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }
  
  cargarProductos();
  
  