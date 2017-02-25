    function escondeLogin(){
        $(".login").hide();
        $("#todo").addClass("listo");
        $("#cabecera").addClass("listo");
        $("#cabecera").show();
        $("#barraUsuarios").show();
        $(".container").show();
        $("#barraRooms").show();
    }

    function cambiaListas(destino){
        $("#salaActual").html(destino);
        $(".mensajes ul.activo").addClass("escondido").removeClass("activo");
        $("#listaMensajes"+destino).addClass("activo").removeClass("escondido")
    }
    function validaNick(nick){
        var reg = /\s/g;
        if (nick.match(reg) == null && 0 < nick.length && nick.length < 16){
            return true
        } else {
            $("#condiciones").show();
            return false
        }
    }


$(document).ready(function(){
    var socket = io();
    var miNick = "";
    var intervalo = null;
    var listaSalasCliente = []
    
    
    
    $("#btnLogin").click( function (){
        nickUsuario = $("#nickUsuario").val();   
        if(validaNick(nickUsuario)){
            $("#superior").html(nickUsuario);
            $("#salaActual").html("Principal");
            imgUsuario = $("#imgSeleccionada").attr('src');
            $("#miAvatar").attr("src", imgUsuario)
            estadoUsuario = $("#estadoUsuario").val();
            
            if(estadoUsuario == ""){
                estadoUsuario = "Disponible"
            }
                
            socket.emit("cogeNick", nickUsuario, imgUsuario, estadoUsuario);
            escondeLogin();       
            
                
           }
        
                
        });
       
    
    function chequea(){
        socket.emit("dejaEscribir", nickUsuario)
        intervalo = null;
    }
    
    $("#sitioQueEscribe").keydown(function (event){
        if(!intervalo){
            socket.emit("escribiendo", nickUsuario)
            
        intervalo = setTimeout(chequea,1000);     
        } else {
            
            clearTimeout(intervalo);
            intervalo = setTimeout(chequea,1000);
        }
                
        
        if(event.keyCode == 13){            
            
            socket.emit("nuevoMensaje", $("#sitioQueEscribe").val(), $("#salaActual").html() );                 
            $("#sitioQueEscribe").val("");
            return false;
        }
    })
    
    socket.on("escribiendo", function(nickUsuario){    
        $("#"+nickUsuario+" #escribiendo").show();
        
    })
    socket.on("dejaEscribir", function(nickUsuario){
        $("#"+nickUsuario+" #escribiendo").hide();
        
    })
        
    
    $("#selImg").click( function (){
        $(".contieneImagenes").show()
        $(".imgPerfil").click(function(){
            $("#imgSeleccionada").attr("src", this.src);
            $(".contieneImagenes").hide()
        })
    })
    socket.on("creaRoomPrivada", function(sala, usuario){
        
        if(listaSalasCliente.indexOf(sala) == -1){
            if(sala != nickUsuario){
                listaSalasCliente.push(sala);
                $(".mensajes").append($("<ul class='privado escondido' id='listaMensajes"+sala+"'></ul>"));
                cambiaListas(sala)
                
            } else{
                listaSalasCliente.push(usuario);
                $(".mensajes").append($("<ul class='privado escondido' id='listaMensajes"+usuario+"'></ul>"));
                cambiaListas(usuario)
                
            }
        } 
    })
    
   socket.on("cargaRooms", function(listaRooms){
        $("#listaSalas").html("");
        var l = listaRooms.concat(listaSalasCliente);
        for(let i=0; i<l.length; i++){
            $("#listaSalas").append($("<li class='sala'>").text(l[i]).click(function(){
               cambiaListas(this.innerHTML)
            }))
       }
   })
    
   
    $("#chat").submit(function(){
        socket.emit("nuevoMensaje", $("#sitioQueEscribe").val());
        $("#sitioQueEscribe").val("");
        return false;
    });
    
    
    socket.on("nuevoMensaje", function(mensaje, lista){
        console.log(mensaje);
        if($("#listaMensajes"+lista).length != 0){
            var sitio = "#listaMensajes"+lista;
        }else{
            var sitio = "#listaMensajes"+mensaje.split(":")[0];
        }
        if($(sitio).hasClass("privado") && (!mensaje.startsWith(nickUsuario+": ") && !mensaje.startsWith(listaSalasCliente))){
            mensaje=null;
            
        }
        //SI SE PASA DE 70 CARACTERES HAY QUE HACER UN \n POR ALGUN SITIO
        if(mensaje != nickUsuario+": " && !mensaje.startsWith("undefined")){
            if(mensaje.startsWith(nickUsuario+": ")){
                $(sitio).append($("<li class='miMensaje'>").text(mensaje).append($("<img class='imgMiBocadillo' src='images/coma2.png'>")));
            }else{
                
                $(sitio).append($("<img class='imgBocadillo' src='images/coma1.png'>"));
                $(sitio).append($("<li>").text(mensaje));
            }       
        }
    });
    
    
    socket.on("asignaNick", function(nick){
        miNick = nick;
    })
    
    
    socket.on("nuevoUsuario", function(numeroUsuarios){
        $("#numUsuarios").html(numeroUsuarios);
    })
    
    
    socket.on("nuevaListaUsuarios", function(listaUsuarios){
        $("#listaUsuarios").html("");
        for(let i=0; i<listaUsuarios.length; i++){
            $("#listaUsuarios").append($("<li id='"+listaUsuarios[i].usuario+"'>").text(listaUsuarios[i].usuario).append($("<img src='" + listaUsuarios[i].img + "'>")).append("<img class='escondido' id='escribiendo' src=images/escribiendo.gif>").append("<br/><span>"+listaUsuarios[i].estado+"</span>").click(function(){
                if(listaUsuarios[i].usuario != nickUsuario){                    
                    socket.emit("creaRoomPrivada", listaUsuarios[i].usuario);
                }
                }).append($("<hr>")));
        }
    })
    
    
    
})