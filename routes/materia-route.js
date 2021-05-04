const router = require('express').Router();
const  Materia =  require('../models/Materia.js')
const Val = require("../middlewares/validaciones.js");
const Alumno = require('../models/Alumno.js');


router.post('/',Val.validarToken,async (req,res)=>{
    console.log("AQUI");
})

router.get('/',Val.validarToken,Val.obtenerMaterias,async (req,res)=>{
    
    res.status(200).send(req.body.materias);

})

router.get('/:materia',async (req,res)=>{
    let materia = await Materia.getMateria({nombre:req.params.materia},{});
    if(materia){
        res.status(200).send(materia);
        return;
    }
    res.status(404).send('Materia no encontrada');
})


router.put('/',Val.validarToken,async(req,res)=>{
    let alumno = await Alumno.getAlumno({correo:req.correo});
    if(!alumno || alumno && !alumno.carrera){
        res.status(400).send('Materias no actualizadas');
        return;
    }
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