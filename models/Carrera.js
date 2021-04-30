'use strict'
const mongoose = require('../db/mongodb_connect')

let carreraSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    descripcion:{
        type:String,
        required:true
    },
    seriasion:[{
        materiaReq:{
          type:String,
          required:true
        },
        materiaSer:{
          type:String,
          required:true
        }
    }]
});

carreraSchema.statics.saveCarrera = async function(user){
    //Suponemos que para este puento el carrera ya fue verificado y cuenta con los atributos necesarios
    let carrera = new Carrera(user);
    let doc;
    try{
         doc = await carrera.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

carreraSchema.statics.getCarrera = async (filtro)=>{
    return await Carrera.findOne(filtro);
}

carreraSchema.statics.getCarreraById = async(id)=>{
    return await Carrera.findById(id);
}

let Carrera = mongoose.model('carrera', carreraSchema);

module.exports = Carrera;