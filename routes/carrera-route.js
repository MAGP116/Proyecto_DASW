const router = require('express').Router()

const Carrera = require('../models/Carrera')

router.get('/', async (req,res)=>{
  let noFilter = {};
  let doc = await Carrera.getCarreras(noFilter);
  let { nombre, descripcion, seriacion} = doc;
  res.status(200).send(({ nombre, descripcion, seriacion}))
})


module.exports = router;