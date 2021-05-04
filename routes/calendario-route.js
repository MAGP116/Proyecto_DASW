const router = require('express').Router()
const Val = require("../middlewares/validaciones.js");
const Calendario = require('../models/Calendario')

router.get('/', Val.validarToken, async (req,res)=>{
  let email = req.correo;
  let doc = await Calendario.getCalendarios(email);
  res.status(200).send(doc)
})

router.get('/:calendario', Val.validarToken, async (req,res)=>{
  let nombre = req.params.calendario
  let doc = await Calendario.getCalendarioById(nombre);
  if (!doc){
    res.status(404).send('Calendario no encontrado')
    return;
  }
  res.status(200).send(doc)
})

router.post('/', Val.validarToken,Val.obtenerMaterias,Val.validarCamposCalendario, async (req,res)=>{
  let {clases,nombre} = req.body;
    let doc = await Calendario.saveCalendario({clase:clases,nombre,alumno:req.correo})
    if(doc){
      res.status(201).send(doc);
      return;
    }
    res.status(400).send('No se consiguio registrar el calendario');
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
    res.status(200).send(doc)
    return;
  }
  res.status(500).send('No se borró el calendario')

})

router.put('/:calendario',Val.validarToken,Val.ajustarEdicionCalendario,Val.obtenerMaterias,Val.validarCamposCalendario, async (req,res)=>{
  let {nombre,clases} = req.body;
  let calendario = await Calendario.updateCalendario(req.params.calendario,{nombre,clase:clases})
  if(calendario){
    res.status(200).send(calendario);
    return;
  }
  res.status(404).send('No se encontró el calendario para el update');
  return;
})

module.exports = router;