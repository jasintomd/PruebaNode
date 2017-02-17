var express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("public"));

http.listen(process.env.PORT || 3000, function(){
    console.log("Está escuchando en el puerto que tiene que escuchar")
})



io.on("connection", function(socket){
    io.emit("nuevoMensaje", "Alguien ha entrado en el chat");
    socket.on("nuevoMensaje", function(mensaje){
        io.emit("nuevoMensaje", mensaje);
    })
})
