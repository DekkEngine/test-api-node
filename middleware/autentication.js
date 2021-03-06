var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verificaToken = function(req, res, next){
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decode)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Token incorrecto'
            });
        }
        req.usuario = decode.usuario;
        next();
    })
}