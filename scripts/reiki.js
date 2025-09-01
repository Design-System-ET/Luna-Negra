document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("enviar_tarot").addEventListener("click", function() {
        window.open(
            "https://api.whatsapp.com/send?phone=59898582316&text=Buenas%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta...", 
            "_blank"
        );
    });

    document.getElementById('cristal_1').addEventListener('click', function () {

      Swal.fire({
          title: 'Chakra Raíz',
          html: '<p style="text-align: center;"> Estoy segura, estable y confío en la vida.</p>',
          //icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(true);
          }
        });

    });

  document.getElementById('cristal_2').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Sacro',
        html: '<p style="text-align: center;"> Soy libre de crear y disfrutar con alegría.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

  document.getElementById('cristal_3').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Plexo Solar',
        html: '<p style="text-align: center;"> Mi poder interior brilla con confianza.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

  document.getElementById('cristal_4').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Corazón',
        html: '<p style="text-align: center;"> El amor fluye en mí y a mi alrededor.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

  document.getElementById('cristal_5').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Garganta',
        html: '<p style="text-align: center;"> Me expreso con claridad y verdad.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

  document.getElementById('cristal_6').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Tercer Ojo',
        html: '<p style="text-align: center;"> Confío en mi intuición y en mi visión interior.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

  document.getElementById('cristal_7').addEventListener('click', function () {

    Swal.fire({
        title: 'Chakra Corona',
        html: '<p style="text-align: center;"> Estoy conectada con la luz y la sabiduría divina.</p>',
        //icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(true);
        }
      });

  });

});