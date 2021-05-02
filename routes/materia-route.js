const router = require('express').Router();
const  Materia =  require('../models/Materia.js')
const  Carrera =  require('../models/Carrera.js')
const Val = require("../middlewares/validaciones.js");


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

module.exports = router;