'use strict'
const mongoose = require('../db/mongodb_connect')

let profesorSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    apellido:{
        type:String,
        required:true
    }
});

profesorSchema.statics.saveProfesor = async function(teacher){
    //Suponemos que para este puento el profesor ya fue verificado y cuenta con los atributos necesarios
    let profesor = new Profesor(teacher);
    let doc;
    try{
         doc = await profesor.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

profesorSchema.statics.getProfesor = async(filtro, atributos) =>{
    atributos = atributos || {};
    return await Profesor.findOne(filtro, atributos);
}
profesorSchema.statics.getProfesores = async(filtro, atributos) =>{
    atributos = atributos || {};
    return await Profesor.find(filtro, atributos);
}


profesorSchema.statics.getProfesorById = async(id)=>{
    try{
        return await Profesor.findById(id);
    }catch(err){
        return;
    }
}

let Profesor = mongoose.model('profesor', profesorSchema);

module.exports = Profesor;