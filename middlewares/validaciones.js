'use strict'
const bcrypt = require("bcryptjs");

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

 //Verifica que la password sea la misma que en el backend
 function validarPassword(req,res,next){
     
     bcrypt.compare(req.body.password, hash).then((res) => {
        if(res){
            next();
        }
        else{
            res.status(404).send("El usuario o contraseña no coinciden");
            return;
        }

   }).catch((err)=>console.log("error",err));
     
 }


 //Realiza la encriptación de la contraseña 
 function encriptarPassword(req,res,next){
     let hash = bcrypt.hashSync(req.body.password,8);
     req.body.password = hash;
     next();
 }




 module.exports = {validarToken,validarAtributosUsuario,validarPassword,encriptarPassword,confirmarPassword};