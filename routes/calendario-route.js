const router = require('express').Router()
const Val = require("../middlewares/validaciones.js");
const Calendario = require('../models/Calendario')

router.get('/', Val.validarToken, async (req,res)=>{
  let email = req.correo;
  let doc = await Calendario.getCalendarios(email);
  res.status(200).send(doc)
})

router.get('/:calendario', Val.validarToken, async (req,res)=>{
  let email = req.correo;
  let nombre = req.params.calendario
  if (!nombre){
    res.status(400).send('Falta nombre del calendario')
  }
  let filter = {email, nombre}
  let doc = await Calendario.getDetalleCalendario(filter);
  if (!doc){
    res.status(404).send('Calendario no encontrado')
  }
  res.status(200).send(doc)
})


module.exports = router;