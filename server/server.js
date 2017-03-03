var express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var numeroUsuarios = 0;
var listaUsuarios = [];
var listaRooms = ["Principal", "América", "África", "Asia"]

app.use(express.static("public"));


http.listen( process.env.PORT || 3128, function(){

    console.log("Está escuchando en el puerto que tiene que escuchar")
})

function anadeLista(usuario, img, estado){
    listaUsuarios.push({usuario, img, estado});
    console.log(listaUsuarios)
}

function quitaLista(usuario){
    listaUsuarios.splice(listaUsuarios.indexOf(usuario),1);
    
}


io.on("connection", function(socket){  
    
    socket.on("cogeNick", function(nickUsuario, imgUsuario, estadoUsuario){
        
            socket.nick = nickUsuario;
            socket.img = imgUsuario;
            socket.estado = estadoUsuario;
            socket.room = "Principal";
            anadeLista(socket.nick, socket.img, socket.estado);
            socket.join("Principal");
            socket.join(nickUsuario);
            io.emit("cargaRooms", listaRooms);
            io.to("Principal").emit("nuevoMensaje", socket.nick +" ha entrado en el chat", "Principal");
            io.emit("nuevaListaUsuarios", listaUsuarios);
            io.emit("asignaNick", socket.id);
            numeroUsuarios++;
            io.emit("nuevoUsuario", numeroUsuarios);
        
    })
    
    socket.on("repeNick", function(nickUsuario){
        if(listaUsuarios.indexOf(nickUsuario) == -1){
            socket.emit("nickValido", nickUsuario);
        }
    })
   
    socket.on("nuevoMensaje", function(mensaje, lista){
        io.emit("nuevoMensaje", socket.nick +": "+ mensaje, lista);

    })
<<<<<<< HEAD
    
    socket.on("escribiendo", function(nickUsuario){
        io.emit("escribiendo", nickUsuario)
        
    })
    socket.on("dejaEscribir", function(nickUsuario){
        io.emit("dejaEscribir", nickUsuario)
        
    })
    
    socket.on("creaRoomPrivada", function(sala){
            console.log(sala, socket.nick);
            socket.join(sala);
            io.sockets.in(sala).emit("creaRoomPrivada", sala, socket.nick)
            io.sockets.in(sala).emit("nuevoMensaje", socket.nick+" ha abierto un chat privado", socket.nick)
         
        io.emit("cargaRooms", listaRooms);
    })
    
    socket.on('disconnect', function () {
        quitaLista(socket.nick);
        numeroUsuarios = listaUsuarios.length
        
        io.emit("nuevaListaUsuarios", listaUsuarios);
        io.emit("nuevoUsuario", numeroUsuarios);
        io.emit("nuevoMensaje", socket.nick + " se ha desconectado")
});
    

})
