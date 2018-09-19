var express = require("express");
var md_aut = require("../middleware/autentication");

var app = express();
var usuarioControlador = require("../controladores/usuario.controlador");

app.get('/probando-controlador', usuarioControlador.probando);
app.post('/crear-usuario', usuarioControlador.crearUsuario);
app.get('/listar', usuarioControlador.listar);
app.post('/login', usuarioControlador.login);
app.put('/actualizar', md_aut.verificaToken, usuarioControlador.actualizarUsuario);

module.exports = app;