document.addEventListener('DOMContentLoaded', function () {


    document.getElementById("enviar_tarot").addEventListener("click", function() {
        window.open(
            "https://api.whatsapp.com/send?phone=59898582316&text=Buenas%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta...", 
            "_blank"
        );
    });

});