const router = require('express').Router()
const Val = require("../middlewares/validaciones.js");
const Carrera = require('../models/Carrera')

router.get('/', async (req,res)=>{
  let doc = await Carrera.getCarreras();
  res.status(200).send(doc)
})

router.get('/:carrera', async (req,res)=>{
  let carrera = await Carrera.getCarrera({nombre:req.params.carrera},{_id:0,seriacion:1})
    if(!carrera){
        res.status(404).send('No se encontro la carrera');
        return;
    }
    let materias = new Set();
    carrera.seriacion.forEach(e => {
        materias.add(e.materiaSer);
    });
    res.status(200).send(Val.topologicSort(materias,carrera.seriacion));
})



module.exports = router;