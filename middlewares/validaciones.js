'use strict'
const bcrypt = require("bcryptjs");
const sign = "AloHom0r4 y abre te sesamo"

 function validarToken(req,res, next){
     //VERIFICAR QUE EL TOKEN ES VALIDO
     let token =  req.get('x-auth')
     if(token){
         jwt.verify(token, 'DASWP21', (err, decoded)=>{
             if(err){
                 console.log(err.name);
                 res.status(401).send({error: "Token no válido"})   
             }else{
                 console.log(decoded);
                 req.correo = decoded.correo;
                 next();
             }
         })
     }else{
         res.status(401).send({error: "falta token"})
     }
 }

function validarCamposLogin(req,res,next){
    let {password,correo} = req.body;
    let error = "Hace falta: ";
    if(!password){
        error += "contraseña "
    }
    if(!correo){
        error += "correo "
    }
    if(!correo || !password){
        res.status(400).send(error);
        return;
    }
    next();
}   

 module.exports = {validarToken,sign,validarCamposLogin};