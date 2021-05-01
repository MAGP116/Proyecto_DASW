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
router.get('/:email',Val.validarToken, async (req,res)=>{
    let email = req.correo;
    if(email != req.params.email){
        res.status(403).send('NO');
        return;
    }
    let doc = await Alumno.getAlumnobyEmail(email);
    let { nombre, apellido, correo, matricula,carrera,materia} = doc;
    res.status(200).send(({ nombre, apellido, correo, matricula,carrera,materia}))
})

//Actualizar campos de usuario.
router.put('/',Val.validarToken,ValAlumnos.encriptarPassword, async (req,res)=>{
    //limitar atributos
    let{carrera,nombre,apellido,password} = req.body
    if(carrera){
        if(carrera == ''){
            res.status(400).send('Completar campos')
            return;
        }
        let doc = await Alumno.getAlumnobyEmail(req.correo);
        
        //verificar la carrear vacia
        if(!doc.carrera){
            doc = await Alumno.updateAlumno({correo:req.correo},{carrera})
            if(doc){
                res.status(200).send(doc);
                return;
            }
            res.status(404).send('No se encontró el usuario para el update');
            return;
        }
        else{
            res.status(400).send('Cambio de carrera no permitido')
            return;
        }
    }
    let a = {};
        
    //verificar atributos
    if(nombre && nombre != ''){
        a.nombre = nombre;
    }
    if(apellido && apellido != ''){
        a.apellido = apellido;
    }
    if(password && password != ''){
        a.password = password;
    }
    if(Object.entries(a).length === 0){
        res.status(400).send('Campos no ingresados');
        return;
    }

    let doc = await Alumno.updateAlumno({correo:req.correo},a);
    if(doc){
        res.status(200).send(doc);
        return;
    }
    res.status(404).send('No se encontró el usuario para el update');
    return;


})


module.exports = router;

