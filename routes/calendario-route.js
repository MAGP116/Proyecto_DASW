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

router.post('/', Val.validarToken, async (req,res)=>{
  //por acer
  return;
})


router.delete('/:calendario', Val.validarToken, async (req,res)=>{
  let calendario = await Calendario.getCalendarioById(req.params.calendario);
  if(!calendario){
    res.status(404).send('No se encontró el calendario');
    return;
  }
  if(calendario.alumno != req.correo){
    res.status(403).send('No tienes autorización');
    return;
  }
  let doc = await Calendario.deleteCalendarioById(req.params.calendario);
  if(doc){
    
    return;
  }
  res.status(500).send('No se borró el calendario')

})


module.exports = router;