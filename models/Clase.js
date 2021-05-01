'use strict'
const mongoose = require('../db/mongodb_connect')
//Revisar lo de sesion, el arreglo
let claseSchema = mongoose.Schema({
    sesion:[{
        dia:{
          type:String,
          required:true
        },
        horaInicio:{
          type:Number,
          required:true
        },
        horafinal:{
          type:Number,
          required:true
        }
    }],
    profesor:{ 
        type:String,
        required:true 
    },
    materia:{
        type:String,
        required:true 
    }
});

claseSchema.statics.saveClase = async function(subjectClass){
    //Suponemos que para este puento el clase ya fue verificado y cuenta con los atributos necesarios
    let clase = new Clase(subjectClass);
    let doc;
    try{
         doc = await clase.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

claseSchema.statics.getClase = async(filtro) =>{
    return await Clase.findOne(filtro);
}

claseSchema.statics.getClaseById = async(id)=>{
    return await Clase.findById(id);
}

let Clase = mongoose.model('clase', claseSchema);

module.exports = Clase;