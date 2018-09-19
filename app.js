var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// RUTAS
var usuario = require("./rutas/usuario.ruta");

// PERMISOS DE CONEXION
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// CONEXION A LA DB
mongoose.connection.openUri('mongodb://127.0.0.1:27017/practicando', (err, res)=>{
    if (err) {
        throw err;
    }else {
        console.log("Base de datos: Online");
        app.listen(3000, ()=>{
            console.log("Express server puerto 3000:", 'Online'); 
        });
    }
});

app.use("/practicando", usuario);