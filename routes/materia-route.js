const router = require('express').Router();
const  Materia =  require('../models/Materia.js')
const Val = require("../middlewares/validaciones.js");


router.post('/',Val.validarToken,async (req,res)=>{
    console.log("AQUI");
})

router.get('/',Val.validarToken,async (req,res)=>{
    console.log("AQUIDELGET");
})














module.exports = router;