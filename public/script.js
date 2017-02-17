
$(document).ready(function(){
    var socket = io();
    
    
    $("#chat").submit(function(){
        socket.emit("nuevoMensaje", $("#sitioQueEscribe").val());
        $("#sitioQueEscribe").val("");
        return false;
    });
    socket.on("nuevoMensaje", function(mensaje){
        $("#listaMensajes").append($("<li>").text(mensaje));
    });
    
})