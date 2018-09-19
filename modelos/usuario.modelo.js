var mongoose = require("mongoose");

var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre      : { type: String, required: [true, 'Nombre de usuario es necesario'] },
    email       : { type: String, unique:true , required : [true, 'Correo es necesario']},
    password    : { type: String, required: [true, 'Contraseña es necesario'] },
    img         : { type: String, required:false }
});

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico'});

module.exports = mongoose.model("Usuario", usuarioSchema);