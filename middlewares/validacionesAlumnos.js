'use strict'
const bcrypt = require("bcryptjs");
const Alumno = require('../models/Alumno')

 //verifica que existan los atributos
 async function  validarAtributosUsuario(req,res,next){
    let {nombre,apellido,correo,matricula,password} = req.body;
    let usuario = {nombre,apellido,correo,matricula,password};
    //Verifica que si existan los campos
    let faltantes = "";
    for(let key in usuario){
        if(!usuario[key])faltantes+=`${key} `;
    }
    if(faltantes.length != 0){
        res.status(400).send(`Hace falta: ${faltantes}`);
        return;
    }
    let usuario2 = await Alumno.getAlumnobyEmail(usuario.correo);
    if(usuario2){
        res.status(400).send('Correo ya utilizado');
        return;
    }
    next();
}

//verifica que las passwords del REGISTRO sean identicas
function confirmarPassword(req,res,next){
    let{password,confPassword} = req.body;
    if(password !== confPassword){
       res.status(400).send("Las contraseñas no coinciden");
       return;
    }
    next();
}


//Realiza la encriptación de la contraseña 
function encriptarPassword(req,res,next){
    if(req.body.password){
        let hash = bcrypt.hashSync(req.body.password,8);
        req.body.password = hash;
    }
    next();
}


module.exports = {validarAtributosUsuario,encriptarPassword,confirmarPassword};