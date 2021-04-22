'use strict'
const mongoose = require('../db/mongodb_connect')

let alumnoSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    apellido:{
        type:String,
        required:true
    },
    correo:{
        type:String,
        required:true,
        unique:true
    },
    matricula:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    carrera:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carrera' 
    },
    materia:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'materia' 
    }]
});

alumnoSchema.statics.saveAlumno = async function(user){
    //Suponemos que para este puento el alumno ya fue verificado y cuenta con los atributos necesarios
    let alumno = new Alumno(user);
    let doc;
    try{
         doc = await alumno.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

let Alumno = mongoose.model('alumno', alumnoSchema);

module.exports = Alumno;