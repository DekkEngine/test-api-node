var Usuario = require("../modelos/usuario.modelo");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

function probando(req, res){
    res.status(200).json({

        ok:true,
        mensaje:'Petición satisfactoria'
    });
}

function crearUsuario(req, res){
    var body = req.body;

    var usuario = new Usuario({
        nombre      :body.nombre,
        email       :body.email,
        password    :bcrypt.hashSync(body.password)
    });

    usuario.save((err, usuarioCreado)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al crear usuario',
                error:err
            });
        }
        res.status(200).json({
            ok:true,
            usuario:usuarioCreado
        });
    });
}

function listar(req, res){
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email')
    .skip(desde)
    .limit(5)
    .exec(
        (err, usuarios)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al buscar usuarios',
                    error:err
                });
            }
            Usuario.count({}, (err, conteo)=>{
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al contar usuarios',
                        error:err
                    });
                }
                res.status(200).json({
                    ok:true,
                    usuario:usuarios,
                    total:conteo
                });
            });
        }
    )
}

function login(req, res){
    var body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al encontrar el usuario',
                error:err
            });
        }
        if (!usuarioDB) {
            return res.status(500).json({
                ok:false,
                mensaje:'Credenciales incorrectas'
            });
        }
        if (!bcrypt.compare(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok:false,
                mensaje:'Credenciales incorrectas'
            });
        }
        usuarioDB.password = ':D';
        var token = jwt.sign({usuario:usuarioDB}, SEED, {expiresIn: 140000} );
        res.status(200).json({
            ok:true,
            usuario:usuarioDB,
            id: usuarioDB._id,
            token : token
        });
    });
}

function actualizarUsuario(req, res){
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar usuario',
                error: err
            });
        }
        if (!usuario) {
            return res.status(500).json({
                ok:false,
                mensaje: 'El usuario con el id: ' + id + 'no existe',
                error: err
            });
        }
        usuario.nombre = body.nombre,
        usuario.email = body.email;

        usuario.save((err, usuarioActualizado)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al actualizar usuario',
                    error:err
                });
            }
            usuarioActualizado.password = ":D";
            res.status(200).json({
                ok:true,
                usuario:usuarioActualizado,                
            });
        });
    });
}

module.exports = {
    probando,
    crearUsuario,
    listar,
    login,
    actualizarUsuario
}