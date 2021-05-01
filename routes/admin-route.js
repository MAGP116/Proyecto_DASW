'use strict'
const router = require('express').Router()
const Val = require("../middlewares/validaciones.js");
const Materia = require('../models/Materia')


router.use(Val.validarToken,Val.validarAdmin);

router.post('/materias',Val.validarCamposMaterias, async (req,res)=>{
    let {nombre, descripcion,creditos} = req.body;
    let doc = await Materia.saveMateria({nombre,descripcion,creditos});
    if(doc){
        res.status(201).send(doc);
        return;
    }
    res.status(400).send('No se pudo registrar la materia');
})




















module.exports = router;