'use strict'
const router = require('express').Router()
const Alumno = require('../models/Alumno')
const Val = require("../middlewares/validaciones.js");


router.post('/',Val.validarAtributosUsuario,Val.confirmarPassword,Val.encriptarPassword, async (req,res)=>{
    let {nombre,apellido,correo,matricula,password} = req.body;
    let doc = await Alumno.saveAlumno({nombre,apellido,correo,matricula,password});
    if(doc){
        res.status(201).send(doc);
        return;
    }
    res.status(400).send("Correo ya registrado");
    

}
)




module.exports = router;
