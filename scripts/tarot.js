document.addEventListener('DOMContentLoaded', function () {


    document.getElementById("enviar_tarot").addEventListener("click", function() {
        window.open(
            "https://api.whatsapp.com/send?phone=59898582316&text=Buenas%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta...", 
            "_blank"
        );
    });


    document.getElementById('carta_1').addEventListener('click', function () {

        Swal.fire({
            title: 'La Luna',
            html: '<p style="text-align: justify;"> Te habla de intuición, ilusiones y verdades ocultas. Muestra que no todo está claro y que hay situaciones que pueden estar nubladas por miedos, dudas o engaños. También te invita a confiar en tu voz interior, porque aunque el camino se vea incierto, tu intuición será la luz que guíe entre la confusión. <br> <br>'  +
                  'No te dejes llevar por apariencias ni temores, escuchá tu intuición, ella sabe la verdad.</p>',
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

    document.getElementById('carta_2').addEventListener('click', function () {

        Swal.fire({
            title: 'La Estrella',
            html: '<p style="text-align: justify;"> La Estrella simboliza esperanza, fe y renovación. Indica un momento de calma después de la tormenta, donde la confianza en el futuro se restaura y la energía fluye con suavidad. Es guía, inspiración y conexión con lo divino.<br> <br>'  +
                  'Confía en que el universo te guía. La Estrella ilumina tu camino y renueva tu fe en lo que viene.</p>',
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

    document.getElementById('carta_3').addEventListener('click', function () {

        Swal.fire({
            title: 'El Sol',
            html: '<p style="text-align: justify;"> El Sol representa claridad, alegría y éxito. Habla de una etapa de iluminación donde todo se ve con mayor nitidez, los vínculos se fortalecen y la confianza personal florece. Es una carta de vitalidad, optimismo y logros que se disfrutan plenamente.<br> <br>'  +
                  'La luz del Sol disipa dudas y sombras. Es tiempo de brillar, confiar y disfrutar de lo que has logrado.</p>',
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

    document.getElementById('cristal_1').addEventListener('click', function () {

      Swal.fire({
          title: 'Chakra Raíz',
          html: '<p style="text-align: justify;"> Estoy segura, estable y confío en la vida.</p>',
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
        html: '<p style="text-align: justify;"> Soy libre de crear y disfrutar con alegría.</p>',
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
        html: '<p style="text-align: justify;"> Mi poder interior brilla con confianza.</p>',
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