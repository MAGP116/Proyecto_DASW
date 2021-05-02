'use strict'
const router = require('express').Router()
const Clase = require('../models/Clase')
const Val = require("../middlewares/validaciones.js");


router.get('/:materia', async (req,res, next)=>{
    let doc = await Clase.getClases({materia:req.params.materia},{_id:1,sesion:1,profesor:1,materia:1})
    if(!doc){
        res.status(404).send('No se encontró la materia');
        return;    
    }
    doc = await Val.convertirProfesores(doc);
    res.status(200).send(doc);
    
  })
  












module.exports = router;

