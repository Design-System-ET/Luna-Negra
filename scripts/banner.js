const imagenes = [
    "url('../images/fondo1.jpg')",
    "url('../images/fondo2.jpg')",
    "url('../images/fondo3.jpg')"
  ];

  let index = 0;
  const banner = document.getElementById("banner");

  function cambiarFondo() {
    banner.style.backgroundImage = imagenes[index];
    index = (index + 1) % imagenes.length;
  }

  // primera imagen al cargar
  cambiarFondo();

  // cambiar cada 5 segundos
  setInterval(cambiarFondo, 5000);