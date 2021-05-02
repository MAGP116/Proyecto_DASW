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
        type:String
    },
    materia:[{
        type:String
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

alumnoSchema.statics.getAlumnobyEmail =  async (correo) => {
   let doc = await Alumno.findOne({correo:correo},{_id:0, nombre:1, apellido:1, correo:1, matricula:1, password:1,carrera:1,materia:1})
   return doc;
}
//filtro: {nombre:juan,apellido:tlaquepaque}
alumnoSchema.statics.getAlumno = async (filtro,atributos) => {
    atributos = atributos || {};
    let doc = await Alumno.findOne(filtro,atributos)
    return doc;
}

alumnoSchema.statics.getAlumnoById = async(id) =>{
    let doc = await Alumno.findById(id);
    return doc;
}


alumnoSchema.statics.updateAlumno = async(filtro,update)=>{
    let doc = await Alumno.findOneAndUpdate(filtro,update,{new: true})
    return doc;
}






let Alumno = mongoose.model('alumno', alumnoSchema);

module.exports = Alumno;