const router = require('express').Router();
const  Materia =  require('../models/Materia.js')
const  Carrera =  require('../models/Carrera.js')
const Val = require("../middlewares/validaciones.js");
const Alumno = require('../models/Alumno.js');


router.post('/',Val.validarToken,async (req,res)=>{
    console.log("AQUI");
})

router.get('/',Val.validarToken,async (req,res)=>{
    console.log("AQUIDELGET");
})

router.get('/:carrera',async (req,res)=>{

    let carrera = await Carrera.getCarrera({nombre:req.params.carrera},{_id:0,seriacion:1})
    if(!carrera){
        res.status(404).send('No se encontro la carrera');
        return;
    }
    let materias = new Set();
    carrera.seriacion.forEach(e => {
        materias.add(e.materiaSer);
    });
    materia = Array.from(materias)
    //FLATA SORTING CHIDO, DE MOMENTO SOLO SON LAS MATERIAS |                       TODO
    res.status(200).send(materia);
})

router.put('/',Val.validarToken,async(req,res)=>{
    let {materias} = req.body
    let matServer = await Materia.getMaterias({},{_id:0,nombre:1});
    let s = new Set(matServer.map(e=>e.nombre));
    let falta = '';
    let size = materias.length;
    for(let i = 0; i<size;i++){
        if(!s.has(materias[i]))falta+=`${i} Materia: ${materias[i]} no existente\n`
    }
    if(falta.length != 0){
        res.status(400).send(falta);
        return;
    }
    let doc = await Alumno.updateAlumno({correo:req.correo},{materia:materias});
    if(!doc){
        res.status(400).send('Materias no actualizadas')
        return;
    }
    res.status(201).send(doc);
})

module.exports = router;