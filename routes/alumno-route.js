'use strict'
const router = require('express').Router()
const Alumno = require('../models/Alumno')
const Val = require("../middlewares/validaciones.js");
const ValAlumnos = require("../middlewares/validacionesAlumnos.js");

//Ingreso de usuario nuevo
router.post('/',ValAlumnos.validarAtributosUsuario,ValAlumnos.confirmarPassword,ValAlumnos.encriptarPassword, async (req,res)=>{
    let {nombre,apellido,correo,matricula,password} = req.body;
    let doc = await Alumno.saveAlumno({nombre,apellido,correo,matricula,password});
    if(doc){
        res.status(201).send(doc);
        return;
    }
    res.status(400).send("Correo ya registrado");
}
)


//Obtener datos de usuario a partir de correo
//Falta meter lo del auth
router.get('/:email',Val.validarToken, async (req,res)=>{
    let doc = await Alumno.getAlumnobyEmail(req.params.email)
    res.send(doc)
})



module.exports = router;

