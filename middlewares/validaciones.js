'use strict'

 function validarToken(req,res, next){
     //VERIFICAR QUE EL TOKEN ES VALIDO
     next();
 }

 function validarAtributosUsuario(req,res,next){
     let {nombre,apellido,correo,matricula,password} = req.body;
     let usuario = {nombre,apellido,correo,matricula,password};
     let faltantes = "";
     for(let key in usuario){
         if(!usuario[key])faltantes+="key ";
     }
     if(faltantes.length != 0){
         res.status(400).send(`Hace falta: ${faltantes}`);
         return;
     }
     next();
 }

 function confirmarPassword(req,res,next){
     let{password,confPassword} = req.body;
     if(password !== confPassword){
        res.status(400).send("Las contraseñas no coinciden");
        return;
     }
     next();
 }

 function validarPassword(req,res,next){
     //HACER VALIDCACION DE QUE LA CONTRASENIA SEA LA QUE EXISTE EN EL BACKEND
     next();
 }

 function encriptarPassword(req,res,next){
     //Hacer encriptamiento de la contrASEÑA PARA EL BACKEND
     next();
 }




 module.exports = {validarToken,validarAtributosUsuario,validarPassword,encriptarPassword,confirmarPassword};