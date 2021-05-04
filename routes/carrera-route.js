const router = require('express').Router()

const Carrera = require('../models/Carrera')

router.get('/', async (req,res)=>{
  let doc = await Carrera.getCarreras();
  res.status(200).send(doc)
})


module.exports = router;